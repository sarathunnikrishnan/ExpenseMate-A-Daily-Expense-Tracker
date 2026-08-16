/**
 * @file base.service.ts
 * @description Abstract BaseService implementing generic database CRUD operations for Mongoose models.
 * Follows Service Layer Architecture guidelines (Rule 6).
 */

import { Model, Document, FilterQuery, UpdateQuery, Types } from 'mongoose';

export abstract class BaseService<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async find(filter: FilterQuery<T> = {}): Promise<T[]> {
    return this.model.find(filter);
  }

  async findById(id: string | Types.ObjectId): Promise<T | null> {
    return this.model.findById(id);
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter);
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async updateById(id: string | Types.ObjectId, updateData: UpdateQuery<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteById(id: string | Types.ObjectId): Promise<T | null> {
    return this.model.findByIdAndDelete(id);
  }
}
