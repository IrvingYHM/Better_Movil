import {IonContent,IonPage,IonInput,IonButton,IonLabel,IonItem,IonIcon,IonToast,IonCheckbox,IonGrid,IonRow,IonCol,} from '@ionic/react';
import { useState, useEffect, useRef, useContext } from 'react';
import { eyeOff, eye } from 'ionicons/icons';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReCAPTCHA from 'react-google-recaptcha';
import { AuthContext } from '../contexts/Auth';
import { StorageService } from '../services/storage';
import React from 'react';
  
  const Login = () => {
    const [mostrarContra, setMostrarContra] = useState(false);
    const [intentosFallidos, setIntentosFallidos] = useState(0);
    const [token, setToken] = useState<string | null>(null);
    const [captchaValue, setCaptchaValue] = useState<string | null>(null);
    const [usuarioLogueado, setUsuarioLogueado] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useContext(AuthContext);
  
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm();
  
    const captcha = useRef<ReCAPTCHA>(null);
  
    useEffect(() => {
      const checkUserStatus = async () => {
        const token = await StorageService.getItem('token');
        if (token) {
          setUsuarioLogueado(true);
        }
      };
      
      checkUserStatus();
    }, []);
  
    const onChange = (value: string | null) => {
      setCaptchaValue(value);
      if (value) {
        console.log('reCAPTCHA completado correctamente');
      }
    };

    const onErrorRecaptcha = () => {
      console.error('Error en reCAPTCHA');
      setCaptchaValue(null);
      toast.error('Error al cargar reCAPTCHA. Por favor, recarga la página.');
    };

    const onExpiredRecaptcha = () => {
      console.log('reCAPTCHA expirado');
      setCaptchaValue(null);
      toast.warning('reCAPTCHA expirado. Por favor, complétalo nuevamente.');
    };
  
    const onSubmit = async (data: any) => {
      // Verificar reCAPTCHA antes de proceder
      if (!captchaValue) {
        toast.error('Por favor completa el reCAPTCHA');
        return;
      }

      setIsSubmitting(true);

      try {
        console.log('Iniciando sesión con reCAPTCHA válido');
        
        const response = await fetch('https://backopt-production.up.railway.app/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...data,
            recaptchaToken: captchaValue
          }),
        });

        if (response.ok) {
          const responseData = await response.json();
          const receivedToken = responseData.token;
          setToken(receivedToken);
          await StorageService.setItem('token', receivedToken);
          login();
          toast.success('Inicio de sesión exitoso');
          setUsuarioLogueado(true);
          
          // Reset intentos fallidos al tener éxito
          setIntentosFallidos(0);
          
          setTimeout(() => {
            window.location.href = '/Home';
          }, 2000);
        } else {
          console.error('Error de inicio de sesión:', response.status);
          const newAttempts = intentosFallidos + 1;
          setIntentosFallidos(newAttempts);
          
          // Reset reCAPTCHA después de un intento fallido
          captcha.current?.reset();
          setCaptchaValue(null);
          
          if (newAttempts >= 3) {
            toast.error('Máximo de intentos fallidos alcanzado. El formulario ha sido deshabilitado.');
          } else {
            toast.error(`Error al iniciar sesión. Intentos restantes: ${3 - newAttempts}`);
          }
        }
        
      } catch (error) {
        console.error('Error de red:', error);
        toast.error('Error de red, intente más tarde');
        
        // Reset reCAPTCHA en caso de error
        captcha.current?.reset();
        setCaptchaValue(null);
        
        setTimeout(() => {
          window.location.href = '/500';
        }, 5000);
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <h3 className="text-center font-bold">Iniciar Sesión</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <IonLabel className="block text-sm font-bold leading-6 text-gray-900">Correo</IonLabel>
              <div className="mt-2" >
                <IonInput
                data-testid="email-input"
                  type="email"
                  id="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register('vchCorreo', {
                    required: 'El campo es requerido',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: 'El formato no es correcto',
                    },
                  })}
                />
              </div>
            </div>
            {errors.vchCorreo?.message && (
              <p className="ion-text-error">{errors.vchCorreo.message as string}</p>
            )}
    
            <div>
              <div className="flex items-center justify-between">
                <IonLabel className="block text-sm font-bold leading-6 text-gray-900">Contraseña</IonLabel>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">¿Ha olvidado su contraseña?</a>
                </div>
              </div>
              <div className="flex items-center mt-2">
                <IonInput
                  type={mostrarContra ? 'text' : 'password'}
                  data-testid="password-input"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register('vchPassword', {
                    required: 'El campo es requerido',
                    minLength: {
                      value: 8,
                      message: 'La contraseña debe tener al menos 8 caracteres',
                    },
                  })}
                />
                 <IonIcon
                slot="start"
                icon={mostrarContra ? eye : eyeOff}
                onClick={() => setMostrarContra(!mostrarContra)}
                className="ion-icon-clickable"
              />
              </div>
    
             
              {errors.vchPassword?.message && (
                <p className="ion-text-error">{errors.vchPassword.message as string}</p>
              )}
            </div>
    
            <IonItem lines="none">
              <IonCheckbox slot="start" />
              <IonLabel>Recordar contraseña</IonLabel>
            </IonItem>
    
            <div className="flex justify-center items-center recaptcha my-4">
              <ReCAPTCHA
                data-testid="recaptcha"
                ref={captcha}
                sitekey="6LfZCW4pAAAAANILT3VzQtWcH_w6JIX1hzNyOBeF"
                onChange={onChange}
                onErrored={onErrorRecaptcha}
                onExpired={onExpiredRecaptcha}
                theme="light"
                size="normal"
              />
            </div>

            {/* Indicador visual del estado del reCAPTCHA */}
            {captchaValue ? (
              <div className="text-center text-green-600 text-sm mb-2">
                ✓ reCAPTCHA completado
              </div>
            ) : (
              <div className="text-center text-gray-500 text-sm mb-2">
                Por favor completa el reCAPTCHA
              </div>
            )}
    
            <IonButton
              expand="block"
              type="submit"
              data-testid="submit-button"
              className="ion-margin-top"
              disabled={intentosFallidos >= 3 || isSubmitting || !captchaValue}
              color={captchaValue && intentosFallidos < 3 ? "primary" : "medium"}
            >
              {isSubmitting ? 'Iniciando sesión...' : 
               intentosFallidos >= 3 ? 'Botón inhabilitado por el máximo de intentos' : 
               !captchaValue ? 'Completa el reCAPTCHA para continuar' :
               'Ingresar'}
            </IonButton>
          </form>
    
          <IonToast
            isOpen={intentosFallidos >= 3}
            message="Máximo de intentos fallidos alcanzado. Por favor, recarga la página para intentar de nuevo."
            duration={8000}
            color="danger"
          />

          {/* Información de ayuda para reCAPTCHA */}
          {intentosFallidos > 0 && intentosFallidos < 3 && (
            <div className="ion-text-center ion-margin-top">
              <small className="text-orange-600">
                Intentos fallidos: {intentosFallidos}/3. 
                {intentosFallidos >= 2 && " ¡Último intento disponible!"}
              </small>
            </div>
          )}
    
          <div className="ion-text-center ion-margin-top">
            <p>
              ¿No tienes una cuenta?{' '}
              <Link to="/RegistroU">Regístrate gratis</Link>
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  export default Login;
  