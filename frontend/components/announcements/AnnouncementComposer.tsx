'use client';

import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { AlertTriangle, Send } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import type { AnnouncementPriority, AnnouncementCategory } from '@/types';

export function AnnouncementComposer() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<AnnouncementPriority>('Normal');
  const [category, setCategory] = useState<AnnouncementCategory>('General');
  const [expiryDate, setExpiryDate] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const submitMutation = useMutation({
    mutationFn: async () => {
      await new Promise((r) => setTimeout(r, 1000));
      return { id: 'new-announcement' };
    },
    onSuccess: () => {
      toast.success(isEmergency ? 'Emergency broadcast sent!' : 'Announcement published!');
      setTitle('');
      setContent('');
      setIsEmergency(false);
      setShowConfirm(false);
    },
  });

  const handleSubmit = () => {
    if (!title || !content) {
      toast.error('Title and content are required');
      return;
    }
    if (isEmergency) {
      setShowConfirm(true);
    } else {
      submitMutation.mutate();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Compose Announcement</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ann-title">Title</Label>
          <Input id="ann-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Announcement title" aria-label="Announcement title" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ann-content">Content</Label>
          <textarea
            id="ann-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your announcement..."
            className="flex min-h-[150px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            aria-label="Announcement content"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as AnnouncementPriority)}>
              <SelectTrigger aria-label="Priority"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Normal">Normal</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as AnnouncementCategory)}>
              <SelectTrigger aria-label="Category"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="General">General</SelectItem>
                <SelectItem value="Health">Health</SelectItem>
                <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                <SelectItem value="Culture">Culture</SelectItem>
                <SelectItem value="Emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ann-expiry">Expiry Date</Label>
            <Input id="ann-expiry" type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} aria-label="Expiry date" />
          </div>
        </div>

        <label className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-destructive/50 bg-destructive/5 cursor-pointer">
          <input type="checkbox" checked={isEmergency} onChange={(e) => setIsEmergency(e.target.checked)} className="h-4 w-4" />
          <div>
            <span className="text-sm font-medium text-destructive flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" /> Send as Emergency Broadcast
            </span>
            <span className="text-xs text-muted-foreground">This will show a full-screen alert to all users</span>
          </div>
        </label>

        <Button onClick={handleSubmit} isLoading={submitMutation.isPending} className="w-full gap-1" id="publish-announcement-btn">
          <Send className="h-4 w-4" /> {isEmergency ? 'Send Emergency Broadcast' : 'Publish Announcement'}
        </Button>

        {/* Emergency Confirmation Dialog */}
        <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" /> Confirm Emergency Broadcast
              </DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              This will immediately send a full-screen emergency alert to ALL users on the platform. Are you sure you want to proceed?
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirm(false)}>Cancel</Button>
              <Button variant="destructive" onClick={() => submitMutation.mutate()} isLoading={submitMutation.isPending}>
                Confirm Broadcast
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
