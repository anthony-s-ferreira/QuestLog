import { UserRepository } from "../repositories/userRepository";
import bcrypt from 'bcrypt';
import generateToken from 


export class UserService {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    };

    async create(name: string, email: string, password: string) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.userRepository.create(name, email, hashedPassword);
        return generateToken(user.id);
    }

    async login(email: string, password: string) {
        const user = await this.userRepository.findByEmail(email);
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid email or password');
        }
        return generateToken(user.id);
    }

    
}