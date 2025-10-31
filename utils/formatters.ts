export const roleOptions= (RoleEnum: Record<string, string>) => Object.values(RoleEnum).map((role) => ({
    label: 
        // role === "user" ? "User" :
        role === "admin" ? "Admin" :
        role === "communityadmin" ? "Community Admin" : role,
    value: role,
  }));