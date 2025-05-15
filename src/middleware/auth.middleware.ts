import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { UserRole } from '../types/index';
import Tutorial from '../models/Tutorial';

// Étendre l'interface Request pour inclure l'utilisateur
declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        username: string;
        email: string;
        roles: UserRole[];
      };
    }
  }
}

class AuthMiddleware {
  /**
   * Middleware qui vérifie si l'utilisateur est authentifié
   */
  async requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Récupérer le token depuis les cookies ou les headers
      const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

      if (!token) {
        res.status(401).json({
          success: false,
          error: 'Authentification requise'
        });
        return;
      }

      // Vérifier et décoder le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        userId: string;
      };

      // Récupérer l'utilisateur
      const user = await User.findById(decoded.userId).select('_id username email roles');

      if (!user) {
        res.status(401).json({
          success: false,
          error: 'Utilisateur non trouvé'
        });
        return;
      }

      // Ajouter l'utilisateur à la requête
      req.user = {
        _id: user._id.toString(),
        username: user.username,
        email: user.email,
        roles: user.roles
      };

      next();
    } catch (error) {
      console.error('Erreur d\'authentification:', error);
      res.status(401).json({
        success: false,
        error: 'Token invalide ou expiré'
      });
    }
  }

  /**
   * Middleware qui vérifie si l'utilisateur a un rôle spécifique
   */
  hasRole(role: UserRole | UserRole[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentification requise'
        });
        return;
      }

      const requiredRoles = Array.isArray(role) ? role : [role];

      // Vérifier si l'utilisateur a au moins un des rôles requis
      const hasRequiredRole = requiredRoles.some(r => req.user?.roles.includes(r));

      if (!hasRequiredRole) {
        res.status(403).json({
          success: false,
          error: 'Accès non autorisé'
        });
        return;
      }

      next();
    };
  }

  /**
   * Middleware qui vérifie si l'utilisateur est admin
   */
  isAdmin(req: Request, res: Response, next: NextFunction): void {
    if (!req.user || !req.user.roles.includes('admin')) {
      res.status(403).json({
        success: false,
        error: 'Accès réservé aux administrateurs'
      });
      return;
    }

    next();
  }

  /**
   * Middleware qui vérifie si l'utilisateur est l'auteur du tutoriel ou un admin
   */
  async isAuthorOrAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentification requise'
      });
      return;
    }

    // Admin a tous les droits
    if (req.user.roles.includes('admin')) {
      next();
      return;
    }

    try {
      const tutorialId = req.params.id || req.params.tutorialId;

      const tutorial = await Tutorial.findById(tutorialId);

      if (!tutorial) {
        res.status(404).json({
          success: false,
          error: 'Tutoriel non trouvé'
        });
        return;
      }

      // Vérifier si l'utilisateur est l'auteur
      if (tutorial.author.toString() !== req.user._id) {
        res.status(403).json({
          success: false,
          error: 'Vous n\'êtes pas autorisé à modifier ce tutoriel'
        });
        return;
      }

      next();
    } catch (error) {
      console.error('Erreur de vérification des droits:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la vérification des droits'
      });
    }
  }
}

export const auth = new AuthMiddleware();
