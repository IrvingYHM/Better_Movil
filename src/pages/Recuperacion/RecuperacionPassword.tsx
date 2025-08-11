import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonText,
  IonSpinner,
  IonAlert,
  IonButtons,
  IonBackButton,
  IonRadioGroup,
  IonRadio,
  IonList
} from '@ionic/react';
import {
  mailOutline,
  lockClosedOutline,
  helpCircleOutline,
  keyOutline,
  chevronBackOutline
} from 'ionicons/icons';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import Footer from '../../components/Footer';

interface RecuperacionForm {
  vchCorreo: string;
}

interface CodigoForm {
  codigo: string;
}

interface PreguntaForm {
  respuesta: string;
}

interface CambioPasswordForm {
  nuevaPassword: string;
  confirmarPassword: string;
}

const RecuperacionPassword: React.FC = () => {
  const [step, setStep] = useState<'email' | 'method' | 'code' | 'question' | 'change'>('email');
  const [correoElectronico, setCorreoElectronico] = useState('');
  const [recoveryMethod, setRecoveryMethod] = useState<'code' | 'question' | null>(null);
  const [preguntaSecreta, setPreguntaSecreta] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error'>('error');

  const { control: emailControl, handleSubmit: handleEmailSubmit, formState: { errors: emailErrors } } = useForm<RecuperacionForm>();
  const { control: codeControl, handleSubmit: handleCodeSubmit, formState: { errors: codeErrors } } = useForm<CodigoForm>();
  const { control: questionControl, handleSubmit: handleQuestionSubmit, formState: { errors: questionErrors } } = useForm<PreguntaForm>();
  const { control: changeControl, handleSubmit: handleChangeSubmit, formState: { errors: changeErrors } } = useForm<CambioPasswordForm>();

  const showToast = (message: string, type: 'success' | 'error') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };

  const onEmailSubmit = async (data: RecuperacionForm) => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://backbetter-production.up.railway.app/clientes/recuperar-contrasena",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        setCorreoElectronico(data.vchCorreo);
        setStep('method');
        showToast("Correo encontrado. Selecciona un método de recuperación.", 'success');
      } else {
        showToast("El correo electrónico no existe en nuestros registros.", 'error');
      }
    } catch (error) {
      showToast("Error de conexión. Intenta nuevamente.", 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleMethodSelection = async (method: 'code' | 'question') => {
    setRecoveryMethod(method);
    setLoading(true);

    if (method === 'code') {
      try {
        const response = await fetch(
          "https://backbetter-production.up.railway.app/clientes/enviar_codigo",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ correoElectronico }),
          }
        );

        if (response.ok) {
          setStep('code');
          showToast("Código enviado al correo electrónico.", 'success');
        } else {
          showToast("Error al enviar el código.", 'error');
        }
      } catch (error) {
        showToast("Error de conexión al enviar código.", 'error');
      }
    } else if (method === 'question') {
      try {
        const response = await fetch(
          `https://backbetter-production.up.railway.app/clientes/pregunta-secreta?correo=${correoElectronico}`
        );

        if (response.ok) {
          const data = await response.json();
          setPreguntaSecreta(data.preguntaSecreta);
          setStep('question');
        } else {
          showToast("Error al obtener la pregunta secreta.", 'error');
        }
      } catch (error) {
        showToast("Error de conexión.", 'error');
      }
    }

    setLoading(false);
  };

  const onCodeSubmit = async (data: CodigoForm) => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://backbetter-production.up.railway.app/clientes/verificar_codigo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            correoElectronico,
            codigo: data.codigo
          }),
        }
      );

      if (response.ok) {
        setStep('change');
        showToast("Código verificado correctamente.", 'success');
      } else {
        showToast("Código incorrecto. Intenta nuevamente.", 'error');
      }
    } catch (error) {
      showToast("Error de conexión.", 'error');
    } finally {
      setLoading(false);
    }
  };

  const onQuestionSubmit = async (data: PreguntaForm) => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://backbetter-production.up.railway.app/clientes/verificar_pregunta",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            correoElectronico,
            respuesta: data.respuesta
          }),
        }
      );

      if (response.ok) {
        setStep('change');
        showToast("Respuesta correcta.", 'success');
      } else {
        showToast("Respuesta incorrecta. Intenta nuevamente.", 'error');
      }
    } catch (error) {
      showToast("Error de conexión.", 'error');
    } finally {
      setLoading(false);
    }
  };

  const onChangeSubmit = async (data: CambioPasswordForm) => {
    if (data.nuevaPassword !== data.confirmarPassword) {
      showToast("Las contraseñas no coinciden.", 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "https://backbetter-production.up.railway.app/clientes/cambiar_contrasena",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            correoElectronico,
            nuevaContrasena: data.nuevaPassword
          }),
        }
      );

      if (response.ok) {
        showToast("Contraseña cambiada exitosamente.", 'success');
        // Redirigir al login después de un tiempo
        setTimeout(() => {
          window.location.href = '/IniciaSesion';
        }, 2000);
      } else {
        showToast("Error al cambiar la contraseña.", 'error');
      }
    } catch (error) {
      showToast("Error de conexión.", 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    switch (step) {
      case 'method':
        setStep('email');
        break;
      case 'code':
      case 'question':
        setStep('method');
        break;
      case 'change':
        setStep(recoveryMethod === 'code' ? 'code' : 'question');
        break;
      default:
        setStep('email');
    }
  };

  const renderEmailStep = () => (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle className="flex items-center">
          <IonIcon icon={mailOutline} className="mr-2 text-blue-600" />
          Recuperar Contraseña
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <form onSubmit={handleEmailSubmit(onEmailSubmit)}>
          <IonItem className="mb-4">
            <IonLabel position="stacked">Correo Electrónico</IonLabel>
            <Controller
              name="vchCorreo"
              control={emailControl}
              rules={{
                required: 'El correo es requerido',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Formato de correo inválido'
                }
              }}
              render={({ field }) => (
                <IonInput
                  {...field}
                  type="email"
                  placeholder="ejemplo@correo.com"
                />
              )}
            />
          </IonItem>
          
          {emailErrors.vchCorreo && (
            <IonText color="danger">
              <p className="text-sm">{emailErrors.vchCorreo.message}</p>
            </IonText>
          )}

          <IonButton
            expand="block"
            type="submit"
            disabled={loading}
            className="mt-4"
          >
            {loading ? <IonSpinner name="crescent" /> : 'Verificar Correo'}
          </IonButton>
        </form>
      </IonCardContent>
    </IonCard>
  );

  const renderMethodStep = () => (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Método de Recuperación</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonText>
          <p className="mb-4">Selecciona cómo deseas recuperar tu contraseña:</p>
        </IonText>

        <IonList>
          <IonRadioGroup value={recoveryMethod} onIonChange={(e: CustomEvent) => handleMethodSelection(e.detail.value)}>
            <IonItem>
              <IonIcon icon={keyOutline} className="mr-3 text-blue-600" />
              <IonLabel>
                <h3>Código por Correo</h3>
                <p>Recibirás un código en tu correo electrónico</p>
              </IonLabel>
              <IonRadio slot="end" value="code" />
            </IonItem>

            <IonItem>
              <IonIcon icon={helpCircleOutline} className="mr-3 text-green-600" />
              <IonLabel>
                <h3>Pregunta Secreta</h3>
                <p>Responde tu pregunta de seguridad</p>
              </IonLabel>
              <IonRadio slot="end" value="question" />
            </IonItem>
          </IonRadioGroup>
        </IonList>
      </IonCardContent>
    </IonCard>
  );

  const renderCodeStep = () => (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle className="flex items-center">
          <IonIcon icon={keyOutline} className="mr-2 text-blue-600" />
          Verificación por Código
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonText>
          <p className="mb-4">Ingresa el código enviado a tu correo electrónico:</p>
        </IonText>

        <form onSubmit={handleCodeSubmit(onCodeSubmit)}>
          <IonItem className="mb-4">
            <IonLabel position="stacked">Código de Verificación</IonLabel>
            <Controller
              name="codigo"
              control={codeControl}
              rules={{ required: 'El código es requerido' }}
              render={({ field }) => (
                <IonInput
                  {...field}
                  type="text"
                  placeholder="123456"
                  maxlength={6}
                />
              )}
            />
          </IonItem>

          {codeErrors.codigo && (
            <IonText color="danger">
              <p className="text-sm">{codeErrors.codigo.message}</p>
            </IonText>
          )}

          <IonButton
            expand="block"
            type="submit"
            disabled={loading}
            className="mt-4"
          >
            {loading ? <IonSpinner name="crescent" /> : 'Verificar Código'}
          </IonButton>
        </form>
      </IonCardContent>
    </IonCard>
  );

  const renderQuestionStep = () => (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle className="flex items-center">
          <IonIcon icon={helpCircleOutline} className="mr-2 text-green-600" />
          Pregunta Secreta
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonText>
          <p className="mb-4 font-semibold">{preguntaSecreta}</p>
        </IonText>

        <form onSubmit={handleQuestionSubmit(onQuestionSubmit)}>
          <IonItem className="mb-4">
            <IonLabel position="stacked">Tu Respuesta</IonLabel>
            <Controller
              name="respuesta"
              control={questionControl}
              rules={{ required: 'La respuesta es requerida' }}
              render={({ field }) => (
                <IonInput
                  {...field}
                  type="text"
                  placeholder="Escribe tu respuesta..."
                />
              )}
            />
          </IonItem>

          {questionErrors.respuesta && (
            <IonText color="danger">
              <p className="text-sm">{questionErrors.respuesta.message}</p>
            </IonText>
          )}

          <IonButton
            expand="block"
            type="submit"
            disabled={loading}
            className="mt-4"
          >
            {loading ? <IonSpinner name="crescent" /> : 'Verificar Respuesta'}
          </IonButton>
        </form>
      </IonCardContent>
    </IonCard>
  );

  const renderChangeStep = () => (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle className="flex items-center">
          <IonIcon icon={lockClosedOutline} className="mr-2 text-orange-600" />
          Nueva Contraseña
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <form onSubmit={handleChangeSubmit(onChangeSubmit)}>
          <IonItem className="mb-4">
            <IonLabel position="stacked">Nueva Contraseña</IonLabel>
            <Controller
              name="nuevaPassword"
              control={changeControl}
              rules={{
                required: 'La contraseña es requerida',
                minLength: {
                  value: 6,
                  message: 'Mínimo 6 caracteres'
                }
              }}
              render={({ field }) => (
                <IonInput
                  {...field}
                  type="password"
                  placeholder="••••••••"
                />
              )}
            />
          </IonItem>

          <IonItem className="mb-4">
            <IonLabel position="stacked">Confirmar Contraseña</IonLabel>
            <Controller
              name="confirmarPassword"
              control={changeControl}
              rules={{ required: 'Confirma tu contraseña' }}
              render={({ field }) => (
                <IonInput
                  {...field}
                  type="password"
                  placeholder="••••••••"
                />
              )}
            />
          </IonItem>

          {changeErrors.nuevaPassword && (
            <IonText color="danger">
              <p className="text-sm">{changeErrors.nuevaPassword.message}</p>
            </IonText>
          )}

          {changeErrors.confirmarPassword && (
            <IonText color="danger">
              <p className="text-sm">{changeErrors.confirmarPassword.message}</p>
            </IonText>
          )}

          <IonButton
            expand="block"
            type="submit"
            disabled={loading}
            className="mt-4"
            color="success"
          >
            {loading ? <IonSpinner name="crescent" /> : 'Cambiar Contraseña'}
          </IonButton>
        </form>
      </IonCardContent>
    </IonCard>
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          {step !== 'email' && (
            <IonButtons slot="start">
              <IonButton onClick={handleBack}>
                <IonIcon icon={chevronBackOutline} />
              </IonButton>
            </IonButtons>
          )}
          <IonTitle>Recuperar Contraseña</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="p-4">
          {step === 'email' && renderEmailStep()}
          {step === 'method' && renderMethodStep()}
          {step === 'code' && renderCodeStep()}
          {step === 'question' && renderQuestionStep()}
          {step === 'change' && renderChangeStep()}
        </div>

        <Footer />

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={alertType === 'success' ? 'Éxito' : 'Error'}
          message={alertMessage}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default RecuperacionPassword;