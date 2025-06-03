"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, User, Lock, Shield, LogIn } from "lucide-react";
import { toast } from "sonner";

interface LoginUser {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'user';
  name: string;
  email: string;
}

const mockUsers: LoginUser[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'Administrador',
    email: 'admin@stockcontrol.com'
  },
  {
    id: '2',
    username: 'usuario',
    password: 'user123',
    role: 'user',
    name: 'Usuário Padrão',
    email: 'usuario@stockcontrol.com'
  },
  {
    id: '3',
    username: 'gerente',
    password: 'gerente123',
    role: 'admin',
    name: 'Gerente de Estoque',
    email: 'gerente@stockcontrol.com'
  }
];

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = mockUsers.find(u => u.username === username && u.password === password);
    
    if (user) {
      toast.success(`Bem-vindo, ${user.name}!`);
      // Aqui você redirecionaria para o dashboard
      // router.push('/dashboard');
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      toast.error('Credenciais inválidas. Tente novamente.');
    }
    
    setIsLoading(false);
  };

  const handleDemoLogin = (user: LoginUser) => {
    setUsername(user.username);
    setPassword(user.password);
    toast.info(`Credenciais de ${user.role === 'admin' ? 'administrador' : 'usuário'} preenchidas`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 p-4">
      {/* Aurora Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-pulse"></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo Aurora */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-4 shadow-2xl shadow-blue-500/25">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></div>
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Aurora Stock
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Sistema de Controle de Estoque
          </p>
        </div>

        <Card className="backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border-white/20 dark:border-slate-700/50 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <LogIn className="h-5 w-5" />
              Fazer Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuário</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Digite seu usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600" 
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            {/* Credenciais de Demo */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 text-center">
                Credenciais de Demonstração
              </h3>
              <div className="space-y-2">
                {mockUsers.map((user) => (
                  <div 
                    key={user.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                    onClick={() => handleDemoLogin(user)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user.username}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant={user.role === 'admin' ? 'default' : 'secondary'}
                      className="flex items-center gap-1"
                    >
                      <Shield className="h-3 w-3" />
                      {user.role === 'admin' ? 'Admin' : 'Usuário'}
                    </Badge>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                Clique em qualquer credencial para preenchê-las automaticamente
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Informações adicionais */}
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© 2025 Aurora Stock Control System</p>
          <p>Sistema desenvolvido para demonstração</p>
        </div>
      </div>
    </div>
  );
}
