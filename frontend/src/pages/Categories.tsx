import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Category } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Trash2 } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('tag'); // default icon
  const [color, setColor] = useState('#4F46E5');
  const [type, setType] = useState<'income' | 'expense'>('expense');

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
      const res = await api.post('/categories', { name, icon, color, type });
      setCategories([...categories, res.data]);
      toast.success('Category added successfully');
      setName(''); // reset form
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      setCategories(categories.filter((c) => c._id !== id));
      toast.success('Category deleted');
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Categories</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Add New Category</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Category Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Groceries"
              />
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as 'income' | 'expense')}
                  className="w-full px-4 py-2 border rounded-lg bg-background-light dark:bg-background-dark border-gray-300 dark:border-gray-700"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    label="Icon Name"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    placeholder="tag"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Color</label>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-12 h-10 p-1 border rounded-lg border-gray-300 dark:border-gray-700 cursor-pointer"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" isLoading={isSubmitting}>
                Add Category
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Your Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading...</p>
            ) : categories.length === 0 ? (
              <p className="text-gray-500">No categories found. Create one to get started.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.map((category) => (
                  <div 
                    key={category._id} 
                    className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center opacity-80"
                        style={{ backgroundColor: `${category.color}20`, color: category.color }}
                      >
                        {/* Placeholder for icon, using first letter instead */}
                        <span className="font-bold">{category.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h4 className="font-medium">{category.name}</h4>
                        <p className="text-xs text-gray-500 capitalize">{category.type}</p>
                      </div>
                    </div>
                    {!category.isDefault && (
                      <button 
                        onClick={() => handleDelete(category._id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete category"
                      >
                        <Trash2 size={18} />
                      </button>
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

export default Categories;
