import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Store } from './store.entity';
import { Rating } from './rating.entity';
import { User } from '../users/user.entity';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store) private storeRepo: Repository<Store>,
    @InjectRepository(Rating) private ratingRepo: Repository<Rating>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async createStore(data: any) {
    const store = this.storeRepo.create(data);
    return this.storeRepo.save(store);
  }

  async getAdminDashboardMetrics() {
    const totalUsers = await this.userRepo.count();
    const totalStores = await this.storeRepo.count();
    const totalRatings = await this.ratingRepo.count();
    return { totalUsers, totalStores, totalRatings };
  }

  async findAllStores(searchName?: string, searchAddress?: string, sortField: string = 'name', sortOrder: 'ASC' | 'DESC' = 'ASC') {
    const query = this.storeRepo.createQueryBuilder('store')
      .leftJoinAndSelect('store.ratings', 'rating');

    if (searchName) {
      query.andWhere('store.name LIKE :name', { name: `%${searchName}%` });
    }
    if (searchAddress) {
      query.andWhere('store.address LIKE :address', { address: `%${searchAddress}%` });
    }

    query.orderBy(`store.${sortField}`, sortOrder);
    const stores = await query.getMany();

    return stores.map(store => {
      const scores = store.ratings.map(r => r.score);
      const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        rating: parseFloat(avg.toFixed(2)),
      };
    });
  }

  async submitOrUpdateRating(userId: number, storeId: number, score: number) {
    if (score < 1 || score > 5) throw new BadRequestException('Rating bounds out of spectrum boundary.');
    
    let rating = await this.ratingRepo.findOne({ where: { user: { id: userId }, store: { id: storeId } } });
    if (rating) {
      rating.score = score;
    } else {
      rating = this.ratingRepo.create({
        user: { id: userId } as any,
        store: { id: storeId } as any,
        score,
      });
    }
    return this.ratingRepo.save(rating);
  }

  async getOwnerDashboard(ownerId: number) {
  const store = await this.storeRepo.findOne({ 
    where: { owner: { id: ownerId } }, 
    relations: {
      owner: true,
      ratings: {
        user: true
      }
    }
  });
  
  if (!store) return { averageRating: 0, reviews: [] };

  const total = store.ratings.reduce((acc, r) => acc + r.score, 0);
  const avg = store.ratings.length ? total / store.ratings.length : 0;

  return {
    averageRating: parseFloat(avg.toFixed(2)),
    reviews: store.ratings.map(r => ({
      userName: r.user.name,
      userEmail: r.user.email,
      score: r.score
    }))
  };
}
}