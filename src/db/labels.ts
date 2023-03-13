import { db } from './db';

export async function getLabels() {
	return db.selectAllX('label');
}
