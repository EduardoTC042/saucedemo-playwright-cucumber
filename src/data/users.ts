/**
 * Catálogo de usuarios de prueba. Los steps referencian usuarios por alias
 * (p. ej. "standard_user"), nunca credenciales en duro dentro del Gherkin.
 */
export interface UserCredentials {
  username: string;
  password: string;
}

const DEFAULT_PASSWORD = process.env.SAUCE_PASSWORD ?? 'secret_sauce';

export const users: Record<string, UserCredentials> = {
  standard_user: { username: 'standard_user', password: DEFAULT_PASSWORD },
  locked_out_user: { username: 'locked_out_user', password: DEFAULT_PASSWORD },
};

export function getUser(alias: string): UserCredentials {
  const user = users[alias];
  if (!user) {
    throw new Error(`Usuario "${alias}" no definido en src/data/users.ts. Disponibles: ${Object.keys(users).join(', ')}`);
  }
  return user;
}
