'use client';

import React, { useCallback, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Upload, X, MapPin, FileIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CATEGORY_OPTIONS, PRIORITY_OPTIONS } from '@/lib/constants';
import { formatFileSize } from '@/lib/utils';

const requestSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title must be under 100 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(1000, 'Description must be under 1000 characters'),
  category: z.enum(['Infrastructure', 'Permits', 'Safety'], { required_error: 'Please select a category' }),
  priority: z.enum(['Low', 'Medium', 'High', 'Emergency'], { required_error: 'Please select a priority' }),
  location: z.string().min(3, 'Location must be at least 3 characters'),
});

type RequestFormData = z.infer<typeof requestSchema>;

interface RequestSubmissionFormProps {
  onSuccess: () => void;
}

export function RequestSubmissionForm({ onSuccess }: RequestSubmissionFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: RequestFormData) => {
      await new Promise((r) => setTimeout(r, 1500));
      return { ticketId: `CR-${Math.floor(1000 + Math.random() * 9000)}` };
    },
    onSuccess: (data) => {
      toast.success(`Request submitted! Ticket ID: ${data.ticketId}`, {
        description: 'You can track your request in the dashboard.',
        duration: 6000,
      });
      onSuccess();
    },
    onError: () => {
      toast.error('Failed to submit request. Please try again.');
    },
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files).slice(0, 5 - files.length);
    setFiles((prev) => [...prev, ...droppedFiles].slice(0, 5));
  }, [files.length]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []).slice(0, 5 - files.length);
    setFiles((prev) => [...prev, ...selected].slice(0, 5));
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: RequestFormData) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="req-title">Title</Label>
        <Input
          id="req-title"
          placeholder="Brief description of your request"
          error={errors.title?.message}
          {...register('title')}
          aria-label="Request title"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="req-desc">Description</Label>
        <textarea
          id="req-desc"
          className="flex min-h-[120px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-colors"
          placeholder="Provide detailed information about the issue..."
          {...register('description')}
          aria-label="Request description"
        />
        {errors.description && (
          <p className="text-xs text-destructive">{errors.description.message}</p>
        )}
      </div>

      {/* Category + Priority */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Category</Label>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger aria-label="Select category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Priority</Label>
          <Controller
            control={control}
            name="priority"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger aria-label="Select priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.priority && <p className="text-xs text-destructive">{errors.priority.message}</p>}
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="req-location">Location</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="req-location"
            placeholder="Address or area description"
            className="pl-10"
            error={errors.location?.message}
            {...register('location')}
            aria-label="Request location"
          />
        </div>
      </div>

      {/* File Upload Zone */}
      <div className="space-y-2">
        <Label>Attachments (max 5)</Label>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer ${
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload')?.click()}
          role="button"
          tabIndex={0}
          aria-label="Drop files here or click to upload"
        >
          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Drag & drop files here, or <span className="text-primary font-medium">browse</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">Images and PDFs, up to 10MB each</p>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            multiple
            accept="image/*,application/pdf"
            onChange={handleFileSelect}
          />
        </div>

        {files.length > 0 && (
          <div className="space-y-2 mt-3">
            {files.map((file, index) => (
              <div key={`${file.name}-${index}`} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <FileIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                  className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button type="submit" className="w-full h-11" isLoading={mutation.isPending} id="submit-request-btn">
        {mutation.isPending ? 'Submitting...' : 'Submit Request'}
      </Button>
    </form>
  );
}
