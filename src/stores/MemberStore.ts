import { LocalDB } from './LocalDB';
import { Member } from '../types';

export const memberDB = new LocalDB<Member>('members'); 