import { Request, Response } from 'express';
declare const registerUser: (req: Request, res: Response) => void;
declare const loginUser: (req: Request, res: Response) => void;
export declare const getAllUsers: (req: Request, res: Response) => void;
export declare const updateUserStatus: (req: Request, res: Response) => void;
export declare const deleteUser: (req: Request, res: Response) => void;
export { registerUser, loginUser };
