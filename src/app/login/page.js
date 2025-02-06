import { a } from "framer-motion/client";
import LOGINFORM from "../components/forms/loginForm";

export default function LOGIN(){
    
    return(
      //   <div className="flex justify-center items-center h-screen bg-gray-100">
      //   <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
      //     <h2 className="text-2xl font-bold text-center mb-6" id="form-title">Se connecter</h2>
      //     <form id="auth-form">
      //       <div className="mb-4">
      //         <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
      //         <input
      //           type="email"
      //           id="email"
      //           name="email"
      //           required
      //           className="w-full mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
      //         />
      //       </div>
      //       <div className="mb-4">
      //         <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
      //         <input
      //           type="password"
      //           id="password"
      //           name="password"
      //           required
      //           className="w-full mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
      //         />
      //       </div>
      //       <button
      //         type="submit"
      //         className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
      //       >
      //         Se connecter
      //       </button>
      //     </form>
      //     <p className="mt-4 text-center text-sm">
      //       Pas encore de compte ?{" "}
      //       <button
      //         id="toggle-auth-mode"
      //         className="text-blue-600 hover:underline"
      //       >
      //         Créer un compte
      //       </button>
      //     </p>
      //   </div>
      // </div>
      <LOGINFORM/>)
   
}