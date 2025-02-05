import { Model, DataTypes, Optional} from 'sequelize';
import sequelize from '../../config/database';

export interface UserType {
    type: 'admin' | 'user';
}

interface UserAttributes {
    id: number;
    name: string;
    email: string;
    password: string;
    type: UserType;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {
    id?: number;
    name: string;
    email: string;
    password: string;
    type: UserType;
}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
    public type!: UserType;
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('admin', 'user'),
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'user',
    timestamps: false,
});