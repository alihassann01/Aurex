'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, Check, Upload, X, FileIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn, formatFileSize } from '@/lib/utils';
import type { PermitType } from '@/types';

const STEPS = ['Basic Info', 'Document Upload', 'Review', 'Submit'];

const basicInfoSchema = z.object({
  type: z.enum(['construction', 'event', 'business'] as const, { required_error: 'Select permit type' }),
  applicantName: z.string().min(2, 'Name is required'),
  address: z.string().min(5, 'Address is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  // Conditional fields
  projectScope: z.string().optional(),
  contractorName: z.string().optional(),
  estimatedCost: z.coerce.number().optional(),
  eventName: z.string().optional(),
  expectedAttendees: z.coerce.number().optional(),
  venueDetails: z.string().optional(),
  businessType: z.string().optional(),
  numberOfEmployees: z.coerce.number().optional(),
  businessName: z.string().optional(),
});

type BasicInfoData = z.infer<typeof basicInfoSchema>;

interface PermitWizardProps {
  type?: PermitType;
  onSuccess?: () => void;
}

const STORAGE_KEY = 'civic-permit-draft';

export function PermitWizard({ type: initialType, onSuccess }: PermitWizardProps) {
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<File[]>([]);

  const savedDraft = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
  const defaultValues = savedDraft ? JSON.parse(savedDraft) : { type: initialType || '' };

  const { register, control, handleSubmit, watch, formState: { errors }, getValues } = useForm<BasicInfoData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues,
  });

  const permitType = watch('type');
  const allValues = watch();

  // Auto-save draft on each change
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allValues));
    }, 500);
    return () => clearTimeout(timeout);
  }, [allValues]);

  const submitMutation = useMutation({
    mutationFn: async () => {
      await new Promise((r) => setTimeout(r, 1500));
      return { permitNumber: `PRM-${Math.floor(10000 + Math.random() * 90000)}` };
    },
    onSuccess: (data) => {
      localStorage.removeItem(STORAGE_KEY);
      toast.success(`Permit application submitted! Number: ${data.permitNumber}`);
      onSuccess?.();
    },
    onError: () => toast.error('Failed to submit permit application.'),
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selected].slice(0, 10));
  };

  const removeFile = (index: number) => setFiles((prev) => prev.filter((_, i) => i !== index));

  const nextStep = () => {
    if (step === 0) {
      handleSubmit(() => setStep(1))();
    } else if (step < 3) {
      setStep(step + 1);
    }
  };

  const prevStep = () => step > 0 && setStep(step - 1);

  const onFinalSubmit = () => submitMutation.mutate();

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center flex-1">
            <div className="flex flex-col items-center relative z-10">
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300',
                i < step ? 'bg-primary border-primary text-primary-foreground' :
                i === step ? 'border-primary text-primary bg-background ring-4 ring-primary/20' :
                'border-border text-muted-foreground bg-background'
              )}>
                {i < step ? <Check className="h-5 w-5" /> : i + 1}
              </div>
              <span className={cn('text-xs mt-1.5 font-medium whitespace-nowrap', i <= step ? 'text-primary' : 'text-muted-foreground')}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn('flex-1 h-0.5 mx-2 -mt-5 transition-colors', i < step ? 'bg-primary' : 'bg-border')} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Basic Info */}
      {step === 0 && (
        <div className="space-y-4 animate-fade-in">
          <div className="space-y-2">
            <Label>Permit Type</Label>
            <Controller control={control} name="type" render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger aria-label="Permit type"><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="construction">Construction Permit</SelectItem>
                  <SelectItem value="event">Event Permit</SelectItem>
                  <SelectItem value="business">Business Permit</SelectItem>
                </SelectContent>
              </Select>
            )} />
            {errors.type && <p className="text-xs text-destructive">{errors.type.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pw-name">Applicant Name</Label>
              <Input id="pw-name" {...register('applicantName')} error={errors.applicantName?.message} aria-label="Applicant name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pw-addr">Address</Label>
              <Input id="pw-addr" {...register('address')} error={errors.address?.message} aria-label="Address" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pw-desc">Description</Label>
            <textarea id="pw-desc" className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none" {...register('description')} aria-label="Permit description" />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pw-start">Start Date</Label>
              <Input id="pw-start" type="date" {...register('startDate')} error={errors.startDate?.message} aria-label="Start date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pw-end">End Date</Label>
              <Input id="pw-end" type="date" {...register('endDate')} error={errors.endDate?.message} aria-label="End date" />
            </div>
          </div>

          {/* Conditional fields */}
          {permitType === 'construction' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50 animate-fade-in">
              <div className="space-y-2"><Label>Project Scope</Label><Input {...register('projectScope')} aria-label="Project scope" /></div>
              <div className="space-y-2"><Label>Contractor Name</Label><Input {...register('contractorName')} aria-label="Contractor name" /></div>
              <div className="space-y-2"><Label>Estimated Cost ($)</Label><Input type="number" {...register('estimatedCost')} aria-label="Estimated cost" /></div>
            </div>
          )}
          {permitType === 'event' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50 animate-fade-in">
              <div className="space-y-2"><Label>Event Name</Label><Input {...register('eventName')} aria-label="Event name" /></div>
              <div className="space-y-2"><Label>Expected Attendees</Label><Input type="number" {...register('expectedAttendees')} aria-label="Expected attendees" /></div>
              <div className="space-y-2 sm:col-span-2"><Label>Venue Details</Label><Input {...register('venueDetails')} aria-label="Venue details" /></div>
            </div>
          )}
          {permitType === 'business' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50 animate-fade-in">
              <div className="space-y-2"><Label>Business Name</Label><Input {...register('businessName')} aria-label="Business name" /></div>
              <div className="space-y-2"><Label>Business Type</Label><Input {...register('businessType')} aria-label="Business type" /></div>
              <div className="space-y-2"><Label>Number of Employees</Label><Input type="number" {...register('numberOfEmployees')} aria-label="Number of employees" /></div>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Document Upload */}
      {step === 1 && (
        <div className="space-y-4 animate-fade-in">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer" onClick={() => document.getElementById('permit-files')?.click()} role="button" tabIndex={0} aria-label="Upload documents">
            <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-medium">Upload required documents</p>
            <p className="text-xs text-muted-foreground mt-1">PDF, images, up to 10MB each</p>
            <input id="permit-files" type="file" className="hidden" multiple accept="image/*,application/pdf" onChange={handleFileSelect} />
          </div>
          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((file, i) => (
                <div key={`${file.name}-${i}`} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <FileIcon className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                  <button type="button" onClick={() => removeFile(i)} className="p-1 hover:bg-destructive/10 rounded" aria-label={`Remove ${file.name}`}>
                    <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 3: Review */}
      {step === 2 && (
        <div className="space-y-4 animate-fade-in">
          <Card>
            <CardContent className="p-6 space-y-3">
              <h3 className="font-semibold text-lg mb-4">Application Summary</h3>
              {Object.entries(getValues()).filter(([_, v]) => v && v !== '').map(([key, value]) => (
                <div key={key} className="flex justify-between py-1.5 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="text-sm font-medium">{String(value)}</span>
                </div>
              ))}
              <div className="flex justify-between py-1.5">
                <span className="text-sm text-muted-foreground">Documents</span>
                <span className="text-sm font-medium">{files.length} file(s)</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 4: Submit Confirmation */}
      {step === 3 && (
        <div className="text-center space-y-4 py-8 animate-fade-in">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Check className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">Ready to Submit</h3>
          <p className="text-muted-foreground max-w-md mx-auto">Please review your application one more time before submitting. You will receive a confirmation email with your permit number.</p>
          <Button onClick={onFinalSubmit} isLoading={submitMutation.isPending} className="h-11 px-8" id="submit-permit-btn">
            {submitMutation.isPending ? 'Submitting...' : 'Submit Application'}
          </Button>
        </div>
      )}

      {/* Navigation Buttons */}
      {step < 3 && (
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={prevStep} disabled={step === 0} className="gap-1">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <Button onClick={nextStep} className="gap-1">
            {step === 2 ? 'Proceed to Submit' : 'Next'} <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
