'use client';

import React, { useMemo, useState } from 'react';
import { Search, UserPlus, ShieldCheck, Briefcase, Mail, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { User, UserRole } from '@/types';

const staffSeed: User[] = [
  {
    id: 'staff-1',
    name: 'Amina Khan',
    email: 'amina@civicconnect.test',
    role: 'staff',
    department: 'Public Works',
    staffId: 'PW-014',
    isVerified: true,
  },
  {
    id: 'staff-2',
    name: 'Marcus Lee',
    email: 'marcus@civicconnect.test',
    role: 'department_admin',
    department: 'Permits Office',
    staffId: 'PO-002',
    isVerified: true,
  },
  {
    id: 'staff-3',
    name: 'Sofia Rivera',
    email: 'sofia@civicconnect.test',
    role: 'staff',
    department: 'Public Safety',
    staffId: 'PS-021',
    isVerified: false,
  },
];

const roleOptions: UserRole[] = ['staff', 'department_admin', 'super_admin'];

export function StaffManagementPanel() {
  const [query, setQuery] = useState('');
  const [staff, setStaff] = useState(staffSeed);

  const filteredStaff = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return staff;
    return staff.filter((member) =>
      [member.name, member.email, member.department, member.staffId]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery))
    );
  }, [query, staff]);

  const addDemoStaff = () => {
    const nextId = staff.length + 1;
    setStaff((current) => [
      {
        id: `staff-${Date.now()}`,
        name: `New Officer ${nextId}`,
        email: `officer${nextId}@civicconnect.test`,
        role: 'staff',
        department: 'Resident Services',
        staffId: `RS-${String(nextId).padStart(3, '0')}`,
        isVerified: false,
      },
      ...current,
    ]);
  };

  const updateRole = (id: string, role: UserRole) => {
    setStaff((current) => current.map((member) => (member.id === id ? { ...member, role } : member)));
  };

  const toggleVerified = (id: string) => {
    setStaff((current) =>
      current.map((member) => (member.id === id ? { ...member, isVerified: !member.isVerified } : member))
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Administration</p>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Staff Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage civic team access, departments, and verification status.
          </p>
        </div>
        <Button onClick={addDemoStaff} className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add Staff
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Active Staff', value: staff.length, icon: Briefcase, tone: 'text-blue-700 bg-blue-50' },
          { label: 'Verified', value: staff.filter((item) => item.isVerified).length, icon: ShieldCheck, tone: 'text-emerald-700 bg-emerald-50' },
          { label: 'Departments', value: new Set(staff.map((item) => item.department)).size, icon: Mail, tone: 'text-amber-700 bg-amber-50' },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                <p className="mt-2 text-3xl font-bold">{item.value}</p>
              </div>
              <div className={cn('flex h-11 w-11 items-center justify-center rounded-lg', item.tone)}>
                <item.icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg">Team Directory</CardTitle>
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search staff, department, or ID"
              className="pl-10"
              aria-label="Search staff"
            />
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b text-left text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                <th className="py-3 pr-4">Name</th>
                <th className="py-3 pr-4">Department</th>
                <th className="py-3 pr-4">Role</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((member) => (
                <tr key={member.id} className="border-b last:border-0">
                  <td className="py-4 pr-4">
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.email}</p>
                  </td>
                  <td className="py-4 pr-4">
                    <p>{member.department}</p>
                    <p className="text-xs text-muted-foreground">{member.staffId}</p>
                  </td>
                  <td className="py-4 pr-4">
                    <select
                      value={member.role}
                      onChange={(event) => updateRole(member.id, event.target.value as UserRole)}
                      className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                      aria-label={`Change role for ${member.name}`}
                    >
                      {roleOptions.map((role) => (
                        <option key={role} value={role}>
                          {role.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-4 pr-4">
                    {member.isVerified ? (
                      <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline">Pending</Badge>
                    )}
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => toggleVerified(member.id)}>
                        {member.isVerified ? 'Pause' : 'Verify'}
                      </Button>
                      <Button variant="ghost" size="icon" aria-label={`More actions for ${member.name}`}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
