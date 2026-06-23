import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from '../users/user.entity';
import { Store } from './store.entity';

@Entity('ratings')
@Unique(['user', 'store'])
export class Rating {
  @PrimaryGeneratedColumn()
  id !: number;

  @Column({ type: 'int' })
  score !: number;

  @ManyToOne(() => User, (user) => user.ratings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user !: User;

  @ManyToOne(() => Store, (store) => store.ratings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store !: Store;
}