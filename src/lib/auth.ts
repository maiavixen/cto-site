import bcrypt from 'bcrypt';
import crypto from 'crypto';
import prisma from './db';

interface RegisterInput {
	username: string;
	password: string;
}

interface LoginInput {
	username: string;
	password: string;
}

export async function register({ username, password }: RegisterInput) {
	// Check if user already exists
	const existingUser = await prisma.user.findFirst({
		where: { username }
	});

	if (existingUser) {
        return { success: false };
	}

	// Hash password
	const hashedPassword = await bcrypt.hash(password, 10);

	// Generate session token
	const session = crypto.randomBytes(32).toString('hex');

	// Create new user
	await prisma.user.create({
		data: {
			username,
			password: hashedPassword,
			session
		}
	});

	return { success: true, session };
}

export async function login({ username, password }: LoginInput) {
	// Find user
	const user = await prisma.user.findFirst({
		where: { username }
	});

	if (!user) {
        return { success: false };
	}

	// Verify password
	const validPassword = await bcrypt.compare(password, user.password);

	if (!validPassword) {
        return { success: false };
	}

	// Generate new session token
	const session = crypto.randomBytes(32).toString('hex');

	// Update user's session
	await prisma.user.update({
		where: { id: user.id },
		data: { session }
	});

	return { success: true, session };
}

export async function validateAndGetSession(session: string) {
	try {
		const user = await prisma.user.findFirst({
			where: { session }
		});

		return user;
	} catch {
		return false;
	}
}

export async function logout(session: string) {
	try {
		await prisma.user.update({
			where: { session },
			data: { session: null }
		});
		return { success: true };
	} catch {
		return { success: false };
	}
}
