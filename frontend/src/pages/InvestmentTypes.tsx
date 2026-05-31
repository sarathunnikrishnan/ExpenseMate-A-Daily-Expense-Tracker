import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Category } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Trash2, TrendingUp, Edit2, X } from 'lucide-react';

const InvestmentTypes = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [behavior, setBehavior] = useState<'fixed' | 'market'>('market');
  const [color, setColor] = useState('#10B981');

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setBehavior('market');
    setColor('#10B981');
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        const res = await api.put(`/categories/${editingId}`, { name, color, investmentBehavior: behavior });
        setCategories(categories.map(c => c._id === editingId ? res.data : c));
        toast.success('Investment Type updated successfully');
      } else {
        const res = await api.post('/categories', { 
          name, 
          icon: 'trending-up', 
          color, 
          type: 'investment',
          investmentBehavior: behavior
        });
        setCategories([...categories, res.data]);
        toast.success('Investment Type added successfully');
      }
      resetForm();
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${editingId ? 'update' : 'add'} investment type`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category._id);
    setName(category.name);
    setBehavior(category.investmentBehavior as any);
    setColor(category.color);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this investment type?')) return;
    try {
      await api.delete(`/categories/${id}`);
      setCategories(categories.filter((c) => c._id !== id));
      toast.success('Deleted successfully');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const investmentCategories = categories.filter(c => c.type === 'investment');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Investment Types</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={20} /> {editingId ? 'Edit Type' : 'Add Type'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Investment Type Name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Mutual Funds, Gold" />
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Tracking Behavior</label>
                <select value={behavior} onChange={(e) => setBehavior(e.target.value as 'fixed' | 'market')} className="w-full px-4 py-2 border rounded-lg bg-background-light dark:bg-background-dark border-gray-300 dark:border-gray-700">
                  <option value="market">Market (ROI tracking)</option>
                  <option value="fixed">Fixed (Maturity Date)</option>
                </select>
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Color</label>
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-10 p-1 border rounded-lg border-gray-300 dark:border-gray-700 cursor-pointer" />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="w-full" isLoading={isSubmitting}>
                  {editingId ? 'Update' : 'Add'} Type
                </Button>
                {editingId && (
                  <Button type="button" variant="outline" onClick={resetForm} className="w-full">
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Your Asset Classes</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <p>Loading...</p> : investmentCategories.length === 0 ? <p className="text-gray-500">No custom investment types found.</p> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {investmentCategories.map((c) => (
                  <div key={c._id} className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center opacity-80 font-bold" style={{ backgroundColor: `${c.color}20`, color: c.color }}>
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium">{c.name}</h4>
                        <p className="text-xs text-gray-500 capitalize">{c.investmentBehavior} Return</p>
                      </div>
                    </div>
                    {!c.isDefault && (
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleEdit(c)} className="p-2 text-gray-400 hover:text-blue-500 transition-colors" title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(c._id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvestmentTypes;
