import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import Footer from './Footer';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // O redirecionamento será tratado pelo AuthContext
    } catch (error) {
      console.error('Erro no login:', error);
      setError('Email ou senha incorretos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <main className="flex-grow flex items-center justify-center px-3 sm:px-4 lg:px-6 py-6 sm:py-12">
        <div className="w-full max-w-sm sm:max-w-md">
          <div className="text-center mb-6 sm:mb-8">
            <img 
              src="https://i.imgur.com/aVevWWG.png" 
              alt="SC Internacional" 
              className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 rounded-full object-contain"
            />
            <h1 className="text-xl sm:text-2xl font-bold text-[#E5050F] mb-1 sm:mb-2">Vestiário</h1>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-[#E5050F] mb-4 sm:mb-6 text-center">
              Login
            </h2>
            
            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent transition-all duration-200"
                  required
                  placeholder="Digite seu email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Senha:
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:border-transparent transition-all duration-200"
                  required
                  placeholder="Digite sua senha"
                />
              </div>

              {error && (
                <div className="p-3 sm:p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                  <p className="text-red-700 text-sm sm:text-base">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#E5050F] text-white py-2 sm:py-3 px-4 rounded-lg hover:bg-[#C5040E] focus:outline-none focus:ring-2 focus:ring-[#E5050F] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-sm sm:text-base"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Entrando...</span>
                  </div>
                ) : (
                  'Entrar'
                )}
              </button>
            </form>

            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-xs sm:text-sm text-gray-600">
                Acesso restrito a administradores
              </p>
            </div>
          </div>

          {/* Informações de demonstração - apenas para desenvolvimento */}
         
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;

