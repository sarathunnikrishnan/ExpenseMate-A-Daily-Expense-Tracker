/**
 * @file InvestmentTypes.tsx
 * @description Page component for managing asset class types and return tracking behavior (Fixed vs Market).
 */

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Category, InvestmentBehavior } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Trash2, TrendingUp, Edit2 } from 'lucide-react';

import {
  INVESTMENT_BEHAVIOR_ENUM,
  DEFAULT_COLORS,
  CATEGORY_TYPES_ENUM,
  API_ROUTES,
  ICONS,
} from '../constants';
import { CATEGORY_MESSAGES } from '../messages';

const InvestmentTypes: React.FC = (): React.ReactElement => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [behavior, setBehavior] = useState<InvestmentBehavior>(
    INVESTMENT_BEHAVIOR_ENUM.MARKET
  );
  const [color, setColor] = useState<string>(DEFAULT_COLORS.SUCCESS);

  const resetForm = (): void => {
    setEditingId(null);
    setName('');
    setBehavior(INVESTMENT_BEHAVIOR_ENUM.MARKET);
    setColor(DEFAULT_COLORS.SUCCESS);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async (): Promise<void> => {
    try {
      const res = await api.get(API_ROUTES.CATEGORIES);
      setCategories(res.data);
    } catch (error) {
      toast.error(CATEGORY_MESSAGES.CATEGORIES_LOAD_FAILED);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        const res = await api.put(`${API_ROUTES.CATEGORIES}/${editingId}`, {
          name,
          color,
          investmentBehavior: behavior,
        });
        setCategories(categories.map((c) => (c._id === editingId ? res.data : c)));
        toast.success(CATEGORY_MESSAGES.INVESTMENT_TYPE_UPDATED);
      } else {
        const res = await api.post(API_ROUTES.CATEGORIES, {
          name,
          icon: ICONS.TRENDING_UP,
          color,
          type: CATEGORY_TYPES_ENUM.INVESTMENT,
          investmentBehavior: behavior,
        });
        setCategories([...categories, res.data]);
        toast.success(CATEGORY_MESSAGES.INVESTMENT_TYPE_ADDED);
      }
      resetForm();
    } catch (error: any) {
      const fallbackMsg = editingId
        ? CATEGORY_MESSAGES.INVESTMENT_TYPE_UPDATE_FAILED
        : CATEGORY_MESSAGES.INVESTMENT_TYPE_ADD_FAILED;
      toast.error(error.response?.data?.message || fallbackMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (category: Category): void => {
    setEditingId(category._id);
    setName(category.name);
    setBehavior(
      (category.investmentBehavior as InvestmentBehavior) ||
        INVESTMENT_BEHAVIOR_ENUM.MARKET
    );
    setColor(category.color);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (!window.confirm(CATEGORY_MESSAGES.CONFIRM_DELETE_INVESTMENT_TYPE)) return;
    try {
      await api.delete(`${API_ROUTES.CATEGORIES}/${id}`);
      setCategories(categories.filter((c) => c._id !== id));
      toast.success(CATEGORY_MESSAGES.INVESTMENT_TYPE_DELETED);
    } catch (error) {
      toast.error(CATEGORY_MESSAGES.INVESTMENT_TYPE_DELETE_FAILED);
    }
  };

  const investmentCategories = categories.filter(
    (c) => c.type === CATEGORY_TYPES_ENUM.INVESTMENT
  );

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
              <Input
                label="Investment Type Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mutual Funds, Gold"
              />

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tracking Behavior
                </label>
                <select
                  value={behavior}
                  onChange={(e) =>
                    setBehavior(e.target.value as InvestmentBehavior)
                  }
                  className={SELECT_CLASS}
                >
                  <option value={INVESTMENT_BEHAVIOR_ENUM.MARKET}>
                    Market (ROI tracking)
                  </option>
                  <option value={INVESTMENT_BEHAVIOR_ENUM.FIXED}>
                    Fixed (Maturity Date)
                  </option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Color
                </label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className={COLOR_INPUT_CLASS}
                />
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
            {isLoading ? (
              <p>Loading...</p>
            ) : investmentCategories.length === 0 ? (
              <p className="text-gray-500">No custom investment types found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {investmentCategories.map((c) => (
                  <div key={c._id} className={ASSET_CARD_CLASS}>
                    <div className="flex items-center gap-3">
                      <div
                        className={AVATAR_BADGE_CLASS}
                        style={{ backgroundColor: `${c.color}20`, color: c.color }}
                      >
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium">{c.name}</h4>
                        <p className="text-xs text-gray-500 capitalize">
                          {c.investmentBehavior} Return
                        </p>
                      </div>
                    </div>
                    {!c.isDefault && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEdit(c)}
                          className={ACTION_EDIT_BTN_CLASS}
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(c._id)}
                          className={ACTION_DELETE_BTN_CLASS}
                          title="Delete"
                        >
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

const SELECT_CLASS = [
  'w-full px-4 py-2 border rounded-lg',
  'bg-background-light dark:bg-background-dark',
  'border-gray-300 dark:border-gray-700',
].join(' ');

const COLOR_INPUT_CLASS = [
  'w-full h-10 p-1 border rounded-lg',
  'border-gray-300 dark:border-gray-700 cursor-pointer',
].join(' ');

const ASSET_CARD_CLASS = [
  'flex items-center justify-between p-4 border rounded-lg',
  'dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50',
].join(' ');

const AVATAR_BADGE_CLASS = [
  'w-10 h-10 rounded-full flex items-center justify-center',
  'opacity-80 font-bold',
].join(' ');

const ACTION_EDIT_BTN_CLASS = [
  'p-2 text-gray-400 hover:text-blue-500',
  'transition-colors',
].join(' ');

const ACTION_DELETE_BTN_CLASS = [
  'p-2 text-gray-400 hover:text-red-500',
  'transition-colors',
].join(' ');

export default InvestmentTypes;
