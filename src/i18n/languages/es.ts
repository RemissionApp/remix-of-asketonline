import { Translations } from '../types/translationTypes';
import { esLegalTranslations } from './es-legal';

export const esTranslations: Translations = {
  welcome: {
    title: 'Asceta',
    description:
      'Plataforma para el crecimiento espiritual a través de la ascesis',
    startButton: 'Comenzar',
    subtitle: 'Tu camino hacia el poder espiritual',
  },
  login: {
    title: 'Iniciar sesión',
    emailLabel: 'Email',
    passwordLabel: 'Contraseña',
    emailPlaceholder: 'ejemplo@email.com',
    passwordPlaceholder: '••••••••',
    forgotPassword: '¿Olvidaste tu contraseña?',
    signInButton: 'Iniciar sesión',
    signUpButton: 'Registrarse',
    noAccount: '¿No tienes una cuenta?',
    haveAccount: '¿Ya tienes una cuenta?',
    emailRequired: 'El email es obligatorio',
  },
  auth: {
    signIn: 'Iniciar sesión',
    signUp: 'Registrarse',
    email: 'Email',
    password: 'Contraseña',
    forgotPassword: '¿Olvidaste tu contraseña?',
    resetPassword: 'Restablecer contraseña',
    resetPasswordSuccess:
      'Se ha enviado instrucciones para restablecer la contraseña a tu email',
    resetPasswordError: 'Error al restablecer la contraseña',
    resetPasswordButton: 'Restablecer contraseña',
    signInButton: 'Iniciar sesión',
    signUpButton: 'Registrarse',
    noAccount: '¿No tienes una cuenta?',
    haveAccount: '¿Ya tienes una cuenta?',
    emailRequired: 'El email es obligatorio',
    passwordRequired: 'La contraseña es obligatoria',
    orContinueWith: 'o continuar con',
    guestSignIn: 'Ingresar como invitado',
    welcomeBack: '¡Bienvenido de nuevo!',
    // OTP traducciones
    enterOtpCode: 'Ingrese código de verificación',
    otpCodeLabel: 'Código de verificación',
    otpSentMessage: 'Enviamos un código de 6 dígitos a',
    verifyButton: 'Verificar',
    resendCode: 'Reenviar código',
    // Mensajes toast
    error: 'Error',
    codeSent: 'Código enviado',
    codeValidated: 'Email verificado',
    loginSuccess: 'Inicio de sesión exitoso',
    checkEmailAndEnterCode: 'Revisa tu email e ingresa el código de verificación',
    failedToSendCode: 'No se pudo enviar el código de verificación',
    failedToVerifyCode: 'No se pudo verificar el código',
    invalidCode: 'Código inválido',
    checkCodeCorrectness: 'Verifica la correcta introducción del código',
    emailVerifiedSuccess: 'Tu email ha sido verificado exitosamente',
    welcomeToAsceta: '¡Bienvenido a Asceta!',
    emailVerifiedSignIn: 'Tu email ha sido verificado exitosamente. Ahora inicia sesión con tus credenciales.',
    verificationError: 'Ocurrió un error al verificar el código',
    // Voice greeting
    voiceGreeting: 'Bienvenido a Asceta',
    clickForAudio: 'Haz clic para activar el sonido',
    stop: 'Detener',
    playGreeting: 'Reproducir saludo',
    // Loading states
    processing: 'Procesando...',
    signingIn: 'Iniciando sesión...',
    checkingAuth: 'Verificando autorización...',
    confirmEmail: 'Confirmar email',
    checkYourEmail: 'Revisa tu email',
    emailConfirmationSent: 'Se ha enviado un email de confirmación a tu dirección de correo. Por favor revisa tu email y haz clic en el enlace para activar tu cuenta.',
    returnToLogin: 'Volver al formulario de inicio de sesión',
    backToSignup: '← Volver al registro',
    enterEmailForReset: 'Por favor ingresa el email para recuperar contraseña',
    // Default user names
    defaultUserName: 'Buscador',
  },
  main: {
    title: 'Principal',
    createPact: 'Crear Ascesis',
    universe: 'Universo',
    profile: 'Perfil',
    comparison: 'Comparación',
    meditation: 'Meditación',
    energyPoints: 'Puntos de Energía',
    totalDays: 'Días Totales',
    currentPacts: 'Ascesis Actuales',
    noPacts: 'Aún no tienes ascesis activas',
    completedToday: 'Completado Hoy',
    daysLeft: 'Días Restantes',
    days: 'Días',
    todayCompleted: 'Completado hoy',
    askUniverse: 'Preguntar al Universo',
    path: 'Camino',
    ascesis: 'Ascesis',
    nav: {
      path: 'Camino',
      ascesis: 'Ascesis',
      universe: 'Universo',
      universeChat: 'Chat',
      profile: 'Perfil',
    },
    failed: 'Interrumpida',
    completed: 'Completada',
  },
  pactOath: {
    title: 'Contrato con el Universo',
    subtitle: 'Antes de comenzar, haz un juramento',
    agreeText: 'Estoy de acuerdo con los términos del contrato',
    oath1:
      'Asumo plena responsabilidad por mi elección y me comprometo a seguirla hasta el final del período de ascesis.',
    oath2:
      'Entiendo que romper el contrato debilitará mi conexión con los poderes superiores y obstaculizará mi crecimiento espiritual.',
    oath3:
      'Seré honesto conmigo mismo y con el Universo al seguir los términos de este contrato.',
    createButton: 'Crear Contrato',
    days: 'días',
  },
  createPact: {
    title: 'Crear Ascesis',
    pactTitle: 'Título de Ascesis',
    pactDuration: 'Duración (días)',
    pactReward: 'Recompensa',
    pactStatus: 'Estado',
    createButton: 'Crear',
    titlePlaceholder: 'Ingrese título...',
    durationPlaceholder: 'Ingrese número de días...',
    rewardPlaceholder: 'Lo que obtendrás a cambio...',
    titleRequired: 'El título es obligatorio',
    durationRequired: 'La duración es obligatoria',
    durationInvalid: 'La duración debe ser un número',
    days: 'días',
    stepOneTitle: 'Elegir tipo de ascesis',
    stepTwoTitle: 'Elegir duración',
    stepThreeTitle: 'Crear contrato',
    placeholders: {
      title: 'Ejemplo: Rechazar azúcar',
      rejection: 'Selecciona o ingresa a qué renuncias',
      reward: 'Lo que obtendrás a cambio...',
    },
    ascesisWarning:
      'La ascesis no es solo abstinencia, sino una herramienta para el crecimiento espiritual y la superación personal.',
    customDays: 'Establecer días personalizados',
    notAsking: 'No pido nada a cambio',
    nextButton: 'Siguiente',
  },
  onboarding: {
    title: 'Bienvenido a Asceta',
    description:
      'Tu guía hacia una vida consciente a través de prácticas espirituales y ascesis',
    goal1: 'Lograr armonía interior',
    goal2: 'Desbloquear el potencial espiritual',
    goal3: 'Limpiar la mente de pensamientos negativos',
    goal4: 'Fortalecer el poder espiritual',
    goal5: 'Encontrar tu camino',
    goal6: "Conocer el verdadero 'Yo'",
    selectGoal: 'Seleccionar meta',
    continueButton: 'Continuar',
    steps: {
      welcome: 'Bienvenida',
      features: 'Funciones Gratuitas',
      proFeatures: 'Funciones Premium',
      complete: 'Completado',
      length: 3,
      map: [],
    },
    freeFeatures: [
      'Crear y seguir prácticas espirituales y ascesis',
      'Ejercicios diarios de meditación',
      'Lecturas básicas de horóscopo',
      'Hacer una pregunta al Universo',
      'Seguimiento de tu progreso espiritual',
    ],
    proFeatures: [
      'Conversaciones ilimitadas con el Universo',
      'Análisis numerológico completo',
      'Lecturas avanzadas de astrología',
      'Contenido premium de meditación',
      'Análisis avanzados del progreso espiritual',
    ],
    buttons: {
      next: 'Siguiente',
      start: 'Comenzar',
      skip: 'Omitir',
      enter: 'Entrar',
      startJourney: 'Iniciar Camino',
    },
  },
  universe: {
    title: 'Universo',
    question: 'Pregunta al Universo',
    answer: 'Respuesta del Universo',
    askButton: 'Preguntar',
    questionPlaceholder: 'Escribe un mensaje...',
    answerPlaceholder: 'La respuesta del Universo aparecerá aquí',
    yourQuestion: 'Tu pregunta',
    universeAnswer: 'Respuesta del Universo',
    newQuestion: 'Nueva pregunta',
    thinking: 'Pensando...',
    previousQuestions: 'Preguntas anteriores',
    description: 'Haz una pregunta al Universo y recibe una respuesta sabia',
    proMessage: 'Desbloquea la capacidad de preguntar al Universo',
    proTitle: 'Pregunta al Universo',
    learnMore: 'Saber más',
    chatTitle: 'Diálogo con el Universo',
    chatDescription: 'Haz una pregunta al Universo',
    enterChat: 'Entrar al chat',
    chatProTitle: 'Diálogo con el Universo',
    chatProMessage: 'Desbloquea PRO para tener un diálogo con el Universo',
    yourConversations: 'Tus conversaciones',
    newChat: 'Nueva conversación',
    noChatsYet: 'Aún no tienes conversaciones',
    startNewChat: 'Iniciar una nueva conversación',
    conversations: 'Conversaciones',
    currentChat: 'Conversación actual',
    startConversation: 'Comienza la conversación con una pregunta',
    newChatTitle: 'Nueva conversación',
    chatTitleLabel: 'Título de la conversación',
    chatTitlePlaceholder: 'Introduce el título de la conversación...',
    errorSendingMessage: 'Error al enviar el mensaje',
    welcomeMessage:
      'El silencio de las estrellas te rodea. En este espacio, nacen respuestas a preguntas que aún no has formulado.',
    defaultWelcomeMessage: '¡Hola! Estoy lista para ayudarte a encontrar respuestas a tus preguntas. ¿De qué te gustaría hablar hoy?',
    newChatCreated: 'Nueva conversación creada',
    errorCreatingChat: 'Error al crear nueva conversación',
  },
  profile: {
    title: 'Perfil',
    name: 'Nombre',
    birthDate: 'Fecha de Nacimiento',
    goal: 'Meta',
    stats: 'Estadísticas',
    achievements: 'Logros',
    saveButton: 'Guardar',
    updateSuccess: 'Perfil actualizado con éxito',
    updateError: 'Error al actualizar el perfil',
    nameRequired: 'El nombre es obligatorio',
    birthDateRequired: 'La fecha de nacimiento es obligatoria',
    savingButton: 'Guardando...',
  },
  meditation: {
    title: 'Meditación',
    description: 'Elige meditación',
    startButton: 'Comenzar',
    play: 'Reproducir',
    unlock: 'Desbloquear',
    pageTitle: 'Meditaciones',
    freeMeditations: 'Meditaciones gratuitas',
    exploreProCollection: 'Explora nuestra colección PRO de meditaciones para prácticas más profundas',
    goToPro: 'Ir a meditaciones PRO',
    categories: {
      all: 'Todas',
      basic: 'Básicas',
      sleep: 'Sueño',
      focus: 'Enfoque',
      advanced: 'Avanzadas',
      morning: 'Mañana',
      evening: 'Noche',
      stress: 'Estrés',
      mantra: 'Mantra',
      visual: 'Visual',
    },
    morning: {
      title: 'Meditación Matutina',
      description: 'Comienza tu día con calma y claridad',
      title1: 'Meditación Matutina',
      desc1: 'Comienza tu día con calma y claridad',
      title2: 'Despertar Matutino',
      desc2: 'Cárgate de energía para el día',
    },
    evening: {
      title: 'Meditación Nocturna',
      description: 'Relájate y restaura energía después del día',
      title1: 'Meditación Nocturna',
      desc1: 'Relájate y restaura energía después del día',
    },
    stress: {
      title: 'Anti-estrés',
      description: 'Libera tensión y ansiedad',
      title1: 'Anti-estrés',
      desc1: 'Libera tensión y ansiedad',
    },
    mantra: {
      title: 'Meditación con Mantras',
      description: 'Usa el poder del sonido para una inmersión profunda',
      title1: 'Meditación con Mantras',
      desc1: 'Usa el poder del sonido para una inmersión profunda',
    },
    visualization: {
      title: 'Visualización',
      description: 'Crea imágenes mentales para lograr objetivos',
      title1: 'Visualización',
      desc1: 'Crea imágenes mentales para lograr objetivos',
    },
  },
  subscription: {
    title: 'Suscripción PRO',
    description:
      'Desbloquea todo el potencial de la aplicación con la suscripción PRO',
    upgradeButton: 'Activar PRO',
    proFeatures: 'Características PRO',
    proTitle: 'PRO',
    cancelButton: 'Cancelar Suscripción',
    successMessage: 'Suscripción activada con éxito',
    errorMessage: 'Error al activar la suscripción',
    bannerTitle: 'Eleva Tu Experiencia Espiritual',
    bannerDesc:
      'Desbloquea acceso completo a todas las meditaciones y funciones',
    upgradeNow: 'Mejorar Ahora',
  },
  nav: {
    home: 'Inicio',
    universe: 'Universo',
    profile: 'Perfil',
    comparison: 'Comparación',
  },
  calendar: {
    today: 'Hoy',
    month: 'Mes',
    year: 'Año',
  },
  minimumPeriod: 'El período mínimo de ascesis es de 30 días',
  userProfile: {
    personal: 'Información Personal',
    name: 'Nombre',
    birthDate: 'Fecha de Nacimiento',
    emailAddressLabel: 'Correo Electrónico',
    updateProfile: 'Actualizar Perfil',
    passwordLabel: 'Contraseña',
    changePassword: 'Cambiar Contraseña',
    profileUpdated: 'Perfil actualizado con éxito',
    updateFailed: 'Error al actualizar el perfil',
    bioLabel: 'Biografía',
    updateButton: 'Actualizar',
    savingButton: 'Guardando...',
    nameRequired: 'El nombre es obligatorio',
    emailRequired: 'El correo electrónico es obligatorio',
    dobRequired: 'La fecha de nacimiento es obligatoria',
    nameLabel: 'Nombre',
    birthDateLabel: 'Fecha de Nacimiento',
    namePlaceholder: 'Ingrese su nombre',
    deleteData: 'Borrar todos los datos',
    deleteDataConfirm: 'La funcionalidad de eliminación de datos se implementará',
    birthDatePlaceholder: 'Elija su fecha de nacimiento',
    title: 'Perfil de Usuario',
    age: 'Edad',
    continueButton: 'Continuar',
    currentDate: 'Fecha actual',
    languageLabel: 'Idioma',
    birthDateRequired: 'La fecha de nacimiento es obligatoria',
    logout: 'Cerrar sesión',
    deleteAccount: 'Eliminar datos de la cuenta',
    accountSettings: 'Configuración de cuenta',
    notifications: 'Notificaciones',
    developerMode: 'Modo desarrollador',
    dataDeleteImplementation: 'La funcionalidad de eliminación de datos será implementada',
  },
  zodiac: {
    yourZodiacSign: 'Tu signo zodiacal',
    element: 'Elemento',
    ruler: 'Regente',
    traits: 'Rasgos',
    editBirthDate: 'Editar fecha de nacimiento',
    saveBirthDate: 'Guardar',
    cancelBirthDate: 'Cancelar',
  },
  numerology: {
    title: 'Numerología',
    description:
      'Descubre tu perfil numerológico y obtén una comprensión profunda de tu personalidad',
    learnMore: 'Más información',
    proTitle: 'Análisis numerológico',
    proMessage: 'Desbloquea PRO para obtener un análisis numerológico completo',
    lifePath: 'Camino de vida',
    analysis: 'Análisis numerológico',
    viewModes: {
      full: 'Completo',
      simple: 'Simple',
      data: 'Datos'
    },
    numbers: {
      lifePath: 'Camino de vida',
      destiny: 'Número del destino',
      soul: 'Número del alma',
      personality: 'Número de personalidad',
      expression: 'Número de expresión'
    },
    descriptions: {
      lifePath: 'El Número del Camino de Vida es tu número más importante. Describe la inclinación natural de tu ser y influye en todos los aspectos de tu existencia.',
      destiny: 'El Número del Destino determina el propósito de tu vida, hacia qué te diriges, qué talentos y habilidades te ayudarán, qué lecciones necesitas aprender.',
      soul: 'El Número del Alma muestra deseos y aspiraciones profundos, nuestros verdaderos motivos para acciones y decisiones, todo lo que está profundo dentro de nosotros.',
      personality: 'El Número de Personalidad muestra cómo otros te perciben, qué impresión causas en otros al primer encuentro.',
      expression: 'El Número de Expresión describe tus talentos, habilidades y herramientas que te ayudarán a seguir tu Camino de Vida.'
    },
    lifePeriods: {
      title: 'Períodos de vida',
      forming: 'Período formativo',
      productive: 'Período productivo',
      wisdom: 'Período de sabiduría'
    },
    enterBirthDateInProfile: 'Ingrese fecha de nacimiento en el perfil'
  },
  common: {
    cancel: 'Cancelar',
    create: 'Crear',
    save: 'Guardar',
    delete: 'Eliminar',
    edit: 'Editar',
    back: 'Atrás',
    next: 'Siguiente',
    submit: 'Enviar',
  },
  legal: esLegalTranslations,
  affirmations: {
    title: 'Afirmaciones',
    description: 'Declaraciones positivas diarias para transformar tu mentalidad',
    categories: {
      all: 'Todas',
      success: 'Éxito',
      confidence: 'Confianza',
      wellbeing: 'Bienestar',
      love: 'Amor',
      abundance: 'Abundancia',
    },
    instructions:
      'Elige una afirmación, medita sobre ella y repítela a diario para lograr un efecto transformador.',
    practiceButton: 'Practicar',
    favoriteButton: 'Añadir a favoritos',
    unfavoriteButton: 'Quitar de favoritos',
    showDetails: 'Mostrar detalles',
    hideDetails: 'Ocultar detalles',
    instruction: 'Instrucción',
    action: 'Acción',
    daily: 'Afirmación del día',
    practice: {
      title: 'Práctica de afirmación',
      step1: 'Encuentra un lugar tranquilo donde no te molesten',
      step2: 'Haz tres respiraciones profundas para centrarte',
      step3: 'Repite la afirmación en voz alta tres veces',
      step4: 'Cierra los ojos y repítela mentalmente otras tres veces',
      step5: 'Visualiza la afirmación como ya realizada en tu vida',
      complete: 'Completar práctica',
      duration: 'Tiempo de práctica recomendado: 2-5 minutos',
    },
  },
  emailOtp: {
    subject: 'Tu código de verificación | Asceta',
    title: 'Código de verificación',
    subtitle: 'Desarrollo espiritual y autoconocimiento',
    codeLabel: 'Tu código de verificación',
    validTime: 'Código válido por 5 minutos',
    instructionsTitle: 'Instrucciones',
    instructions: 'Ingresa este código en la aplicación Asceta para verificar tu dirección de email. El código es válido por 5 minutos.',
    footerNote: 'Si no te registraste en Asceta, ignora este email.',
  },
  deleteAccount: {
    title: 'Eliminar Cuenta',
    warning: '¡Esta acción es irreversible!',
    description: 'Todos sus datos, incluidas las ascesis, logros e información del perfil se eliminarán permanentemente.',
    confirmationText: 'Entiendo que esta acción es irreversible y todos mis datos serán eliminados permanentemente',
    passwordLabel: 'Ingrese su contraseña para confirmar',
    passwordPlaceholder: 'Su contraseña',
    deleteButton: 'Eliminar Cuenta Permanentemente',
    deleting: 'Eliminando...',
    fillAllFields: 'Complete todos los campos',
    accountDeleted: 'Cuenta eliminada exitosamente',
    deleteError: 'Error al eliminar la cuenta',
  },
  notFound: {
    title: '404',
    message: '¡Ups! Página no encontrada',
    returnHome: 'Volver al inicio',
  },
  
  missions: {
    'synchronicity-hunter': {
      title: 'Cazador de Sincronicidades',
      description: 'Explora las coincidencias místicas en tu vida y aprende a leer las señales del Universo',
      requirements: [
        'Mantén un diario de sincronicidades',
        'Analiza patrones',
        'Crea un mapa de coincidencias'
      ],
      dailyQuestions: {
        1: '¿Qué coincidencias inusuales notaste hoy?',
        3: 'Califica la fuerza de las sincronicidades de hoy del 1 al 10',
        5: 'Fotografía o describe la coincidencia más vívida',
        7: '¿Qué patrones has descubierto durante la semana de observaciones?'
      },
      choiceEvents: {
        'sync-path-choice': {
          title: 'Camino de exploración',
          description: 'Elige cómo desarrollarás tu habilidad para notar sincronicidades',
          choices: {
            'intuitive-path': 'Confiar en la intuición y los sentimientos',
            'analytical-path': 'Analizar y registrar todo detalladamente'
          }
        }
      },
      milestoneRewards: {
        3: '¡Tu percepción se está agudizando! 🔮',
        7: '¡Recibiste un artefacto místico! ✨'
      }
    },
    'energy-detox-21': {
      title: 'Desintoxicación Energética',
      description: 'Transformación integral del campo energético a través de la liberación de hábitos tóxicos y prácticas de purificación',
      requirements: [
        'Deshazte de los vampiros energéticos',
        'Practica técnicas de purificación',
        'Crea un nuevo régimen energético'
      ],
      dailyQuestions: {
        1: '¿Qué agota más tu energía?',
        7: 'Califica tu nivel de energía comparado con el inicio',
        14: '¿Qué nuevas prácticas han traído mayor beneficio?',
        21: 'Fotografía un símbolo de tu energía renovada'
      },
      choiceEvents: {
        'detox-method': {
          title: 'Método de purificación',
          description: 'Elige el enfoque principal para la desintoxicación energética',
          choices: {
            'gentle-cleansing': 'Purificación suave y gradual',
            'intensive-purge': 'Purificación intensiva y radical'
          }
        },
        'energy-source': {
          title: 'Fuente de poder',
          description: 'Determina cuál será tu principal fuente de energía',
          choices: {
            'nature-connection': 'Conexión con la naturaleza y los elementos',
            'inner-fire': 'Fuego interior y autodisciplina',
            'cosmic-flow': 'Flujo de energía cósmica'
          }
        }
      },
      milestoneRewards: {
        7: '¡Tu energía comienza a purificarse! 🌟',
        14: '¡Sientes una oleada de fuerza! ⚡',
        21: '¡Transformación energética completada! 🔥'
      }
    },
    'dream-explorer': {
      title: 'Explorador de Sueños',
      description: 'Sumérgete en el mundo de los sueños lúcidos y revela los secretos de tu subconsciente',
      requirements: [
        'Mantén un diario detallado de sueños',
        'Practica técnicas de atención plena',
        'Crea un mapa del mundo onírico'
      ],
      dailyQuestions: {
        1: 'Describe el sueño más vívido que recuerdes',
        5: '¿Qué tan claramente recuerdas los sueños (1-10)?',
        10: '¿Has tenido sueños lúcidos?',
        14: 'Dibuja o describe un símbolo de tus sueños'
      },
      choiceEvents: {
        'dream-technique': {
          title: 'Técnica de conciencia',
          description: 'Elige un método para desarrollar sueños lúcidos',
          choices: {
            'reality-checks': 'Verificaciones de realidad durante el día',
            'wake-back-to-bed': 'Técnica WBTB (despertar y volver a dormir)',
            'mnemonic-induction': 'Inducción mnemónica (MILD)'
          }
        }
      },
      milestoneRewards: {
        7: '¡Tus sueños se vuelven más brillantes! 🌙',
        14: '¡Has dominado el arte de los sueños! ✨'
      }
    },
    'gratitude-alchemist': {
      title: 'Alquimista de la Gratitud',
      description: 'Transforma cualquier situación de la vida en fuentes de gratitud y fuerza',
      requirements: [
        'Encuentra bendiciones en las dificultades',
        'Crea un ritual de gratitud',
        'Comparte gratitud con el mundo'
      ],
      dailyQuestions: {
        1: '¿Por qué estás especialmente agradecido hoy?',
        5: 'Encuentra una bendición oculta en una dificultad reciente',
        8: '¿A quién expresaste gratitud hoy?',
        10: 'Fotografía algo que simbolice tu gratitud'
      },
      choiceEvents: {
        'gratitude-style': {
          title: 'Estilo de gratitud',
          description: '¿Cómo prefieres expresar gratitud?',
          choices: {
            'inner-gratitude': 'Meditaciones y reflexiones internas',
            'creative-gratitude': 'Expresión creativa (cartas, arte)',
            'active-gratitude': 'Actos activos y ayudar a otros'
          }
        }
      },
      milestoneRewards: {
        5: '¡Tu corazón se llena de calidez! 💖',
        10: '¡La gratitud transforma tu vida! 🌈'
      }
    },
    'time-alchemist': {
      title: 'Alquimista del Tiempo',
      description: 'Cambia tu percepción del tiempo y aprende a controlar su flujo',
      requirements: [
        'Explora diferentes estados del tiempo',
        'Practica técnicas de expansión temporal',
        'Crea un ritual temporal personal'
      ],
      dailyQuestions: {
        1: '¿Cómo sientes el flujo del tiempo en diferentes situaciones?',
        7: 'Califica qué tan lento fue el tiempo hoy (1-10)',
        14: 'Describe tu ritmo de vida ideal'
      },
      choiceEvents: {
        'time-approach': {
          title: 'Enfoque del tiempo',
          description: 'Elige la filosofía principal de trabajar con el tiempo',
          choices: {
            'flow-state': 'Inmersión en un estado de flujo',
            'mindful-presence': 'Presencia consciente en el momento',
            'time-expansion': 'Técnicas de expansión temporal'
          }
        }
      },
      milestoneRewards: {
        7: '¡El tiempo comienza a ralentizarse bajo tu control! ⏳',
        14: '¡Te has convertido en el maestro de tu tiempo! 🕰️'
      }
    }
  },
  pactCompletion: {
    title: '¡Felicitaciones por completar tu ascesis!',
    completedDays: 'Completaste la ascesis durante {days} días seguidos',
    goalTitle: 'Tu meta:',
    universeMessage: '✨ El Universo ha escuchado cada paso que diste en este camino. Si realizaste la ascesis honestamente y con plena dedicación, la energía del Cosmos ya está trabajando para cumplir tu deseo. Confía en el proceso - lo que realmente necesitas llegará en el momento adecuado. ✨',
    energyEarned: 'Energía Ganada',
    totalDays: 'Días Totales',
    shareButton: 'Compartir',
    newPactButton: 'Nueva Ascesis',
    closeButton: 'Continuar',
    shareTitle: '¡Completé ascesis en Asceta!',
    shareText: 'Completé la ascesis "{title}" durante {days} días y gané {energy} energía! Únete al desarrollo espiritual en Asceta.',
  },
  lyra: {
    voiceGuide: 'Lyra',
    callButton: 'Conectar con Lyra',
    callScreen: 'Tu sesión con Lyra',
    callHistory: 'Conversaciones con Lyra',
    callSubtitle: 'Tu guía espiritual, siempre presente',
    minutesLeft: 'Tienes {{count}} minutos este mes',
    limitReachedCta: 'Límite alcanzado — suscríbete para continuar',
    hearFromGuide: 'Escuchar de Lyra',
  },
};
