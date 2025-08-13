// components/PatientForm.tsx
import { useState } from 'react';
import { api } from '../lib/api';

type Patient = {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dob?: string;
};

export default function PatientForm({ initial, onClose }: { initial: Patient | null, onClose: ()=>void }) {
  const [firstName, setFirstName] = useState(initial?.firstName || '');
  const [lastName, setLastName] = useState(initial?.lastName || '');
  const [email, setEmail] = useState(initial?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(initial?.phoneNumber || '');
  const [dob, setDob] = useState(initial?.dob || '');
  const [err, setErr] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    const payload = { firstName, lastName, email, phoneNumber, dob };
    const url = initial ? `/patients/${initial.id}` : '/patients';
    const method = initial ? 'PUT' : 'POST';
    const res = await api(url, { method, body: JSON.stringify(payload) });
    if (!res.ok) {
      const body = await res.json().catch(()=>({ error: 'Failed' }));
      setErr(body.error || 'Failed');
      return;
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
      <form onSubmit={submit} className="bg-white p-6 rounded w-full max-w-md">
        <h2 className="text-xl mb-4">{initial ? 'Edit Patient' : 'New Patient'}</h2>
        {err && <div className="text-red-600 mb-2">{err}</div>}
        <input className="w-full p-2 border mb-2" placeholder="First name" value={firstName} onChange={e=>setFirstName(e.target.value)} />
        <input className="w-full p-2 border mb-2" placeholder="Last name" value={lastName} onChange={e=>setLastName(e.target.value)} />
        <input className="w-full p-2 border mb-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full p-2 border mb-2" placeholder="Phone number" value={phoneNumber} onChange={e=>setPhoneNumber(e.target.value)} />
        <input className="w-full p-2 border mb-4" placeholder="DOB (YYYY-MM-DD)" value={dob} onChange={e=>setDob(e.target.value)} />
        <div className="flex justify-end">
          <button type="button" onClick={onClose} className="mr-2 px-3 py-1">Cancel</button>
          <button className="bg-indigo-600 text-white px-4 py-1 rounded">{initial ? 'Save' : 'Create'}</button>
        </div>
      </form>
    </div>
  );
}
