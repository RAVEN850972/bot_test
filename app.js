document.addEventListener('DOMContentLoaded', function() {
  // Инициализация Telegram WebApp
  const tgWebApp = window.Telegram.WebApp;
  tgWebApp.expand();
  tgWebApp.enableClosingConfirmation();
  
  // Установка темы на основе темы Telegram
  if (tgWebApp.colorScheme === 'dark') {
    document.body.classList.add('dark-theme');
  }
  
  // DOM элементы
  const connectWalletBtn = document.getElementById('connect-wallet-btn');
  const walletStatus = document.getElementById('wallet-status');
  const paymentBtn = document.getElementById('payment-btn');
  const paymentStatus = document.getElementById('payment-status');
  const walletConnectedSpan = document.getElementById('wallet-connected');
  const paymentCompletedSpan = document.getElementById('payment-completed');
  const eligibilityStatusSpan = document.getElementById('eligibility-status');
  const submitBtn = document.getElementById('submit-btn');
  
  // Конфигурация
  const TON_PAYMENT_AMOUNT = 0.5;
  
  // Данные пользователя
  const userData = {
    userId: tgWebApp.initDataUnsafe?.user?.id || 0,
    walletConnected: false,
    walletAddress: null,
    paymentCompleted: false
  };
  
  // Обновление UI
  function updateUI() {
    // Wallet status
    if (userData.walletConnected) {
      walletStatus.textContent = `Подключен: ${userData.walletAddress.slice(0, 6)}...${userData.walletAddress.slice(-4)}`;
      walletConnectedSpan.textContent = '✅';
      walletConnectedSpan.className = 'success';
      connectWalletBtn.textContent = 'Кошелек подключен';
      connectWalletBtn.disabled = true;
      paymentBtn.disabled = false;
      paymentStatus.textContent = 'Готов к оплате';
    } else {
      walletStatus.textContent = 'Не подключен';
      walletConnectedSpan.textContent = '❌';
      walletConnectedSpan.className = 'error';
      connectWalletBtn.disabled = false;
      paymentBtn.disabled = true;
      paymentStatus.textContent = 'Ожидание подключения кошелька';
    }
    
    // Payment status
    if (userData.paymentCompleted) {
      paymentCompletedSpan.textContent = '✅';
      paymentCompletedSpan.className = 'success';
      paymentBtn.textContent = 'Оплачено';
      paymentBtn.disabled = true;
      paymentStatus.textContent = 'Оплачено';
      submitBtn.disabled = false;
    } else {
      paymentCompletedSpan.textContent = '❌';
      paymentCompletedSpan.className = 'error';
      paymentBtn.disabled = !userData.walletConnected;
      submitBtn.disabled = true;
    }
    
    // Eligibility status
    if (userData.walletConnected && userData.paymentCompleted) {
      eligibilityStatusSpan.textContent = 'Имеете право! 🎉';
      eligibilityStatusSpan.className = 'success';
    } else {
      eligibilityStatusSpan.textContent = 'Не имеете права';
      eligibilityStatusSpan.className = 'error';
    }
  }
  
  // Функция подключения кошелька
  async function connectWallet() {
    try {
      // Имитация подключения кошелька TON
      // В реальном приложении используйте ton-connect или другие библиотеки
      
      // Имитация выбора и подключения кошелька
      tgWebApp.showPopup({
        title: 'Выбор кошелька',
        message: 'Выберите способ подключения кошелька TON:',
        buttons: [
          {
            id: 'tonkeeper',
            type: 'default',
            text: 'Tonkeeper'
          },
          {
            id: 'tonhub',
            type: 'default',
            text: 'Tonhub'
          },
          {
            id: 'cancel',
            type: 'cancel',
            text: 'Отмена'
          }
        ]
      }, function(buttonId) {
        if (buttonId === 'cancel') return;
        
        // Симуляция успешного подключения кошелька
        setTimeout(() => {
          // Генерация фейкового адреса кошелька TON
          const walletAddress = 'UQ' + [...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
          
          // Обновление UI
          userData.walletConnected = true;
          userData.walletAddress = walletAddress;
          
          // Обновление данных на сервере
          updateWalletOnServer(walletAddress);
          
          // Обновление интерфейса
          updateUI();
          
          tgWebApp.showPopup({
            title: 'Кошелек подключен',
            message: 'Ваш TON кошелек успешно подключен.',
            buttons: [{ type: 'ok' }]
          });
        }, 1500);
      });
    } catch (error) {
      console.error('Ошибка подключения кошелька:', error);
      walletStatus.textContent = `Ошибка: ${error.message || 'Не удалось подключить кошелек'}`;
      walletStatus.className = 'error';
      
      tgWebApp.showPopup({
        title: 'Ошибка подключения',
        message: 'Не удалось подключить ваш кошелек. Пожалуйста, попробуйте снова.',
        buttons: [{ type: 'ok' }]
      });
    }
  }
  
  // Функция оплаты
  async function makePayment() {
    if (!userData.walletConnected) {
      tgWebApp.showPopup({
        title: 'Ошибка',
        message: 'Пожалуйста, сначала подключите кошелек TON.',
        buttons: [{ type: 'ok' }]
      });
      return;
    }
    
    // Адрес кошелька для оплаты
    const paymentAddress = "UQD7tZfGymvepTgjBQYNeFIR-5IWj3P276uYgH0U_8p3B7QM";
    
    // Создаем уникальный идентификатор транзакции для пользователя
    const transactionId = `NVX_AIRDROP_${userData.userId}_${new Date().getTime()}`;
    
    // В реальном приложении здесь должна быть интеграция с TON Pay или другой платежной системой
    
    tgWebApp.showPopup({
      title: 'Оплата участия',
      message: `Для участия в аирдропе необходимо отправить ${TON_PAYMENT_AMOUNT} TON на кошелек:\n\n${paymentAddress}\n\nС комментарием: ${transactionId}`,
      buttons: [
        {
          id: 'payment_confirmed',
          type: 'default',
          text: 'Я оплатил(а)'
        },
        {
          id: 'cancel',
          type: 'cancel',
          text: 'Отмена'
        }
      ]
    }, function(buttonId) {
      if (buttonId === 'cancel') return;
      
      if (buttonId === 'payment_confirmed') {
        // В реальном приложении здесь должна быть проверка платежа через API блокчейна TON
        // Для примера мы просто отметим оплату как выполненную
        
        // Симуляция проверки платежа
        setTimeout(() => {
          userData.paymentCompleted = true;
          
          // Обновление данных на сервере
          updatePaymentOnServer(transactionId, TON_PAYMENT_AMOUNT);
          
          // Обновление интерфейса
          updateUI();
          
          tgWebApp.showPopup({
            title: 'Оплата подтверждена',
            message: 'Ваш платеж успешно подтвержден. Теперь вы можете завершить регистрацию для участия в аирдропе.',
            buttons: [{ type: 'ok' }]
          });
        }, 2000);
      }
    });
  }
  
  // Обновление кошелька на сервере
  async function updateWalletOnServer(walletAddress) {
    try {
      const response = await fetch(`${API_URL}/api/update-wallet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userData.userId,
          wallet_address: walletAddress
        })
      });
      
      const data = await response.json();
      console.log('Ответ сервера:', data);
    } catch (error) {
      console.error('Ошибка обновления кошелька на сервере:', error);
    }
  }
  
  // Обновление оплаты на сервере
  async function updatePaymentOnServer(paymentHash, amount) {
    try {
      const response = await fetch(`${API_URL}/api/update-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userData.userId,
          payment_hash: paymentHash,
          amount: amount
        })
      });
      
      const data = await response.json();
      console.log('Ответ сервера:', data);
    } catch (error) {
      console.error('Ошибка обновления оплаты на сервере:', error);
    }
  }
  
  // Завершение участия
  function submitParticipation() {
    if (userData.walletConnected && userData.paymentCompleted) {
      tgWebApp.showPopup({
        title: 'Участие подтверждено',
        message: 'Поздравляем! Вы успешно зарегистрировались для участия в аирдропе токена NVX. Токены будут распределены после завершения периода аирдропа.',
        buttons: [{ type: 'ok' }]
      });
      
      // Закрытие WebApp и возврат в бота
      setTimeout(() => {
        tgWebApp.close();
      }, 3000);
    }
  }
  
  // Слушатели событий
  connectWalletBtn.addEventListener('click', connectWallet);
  paymentBtn.addEventListener('click', makePayment);
  submitBtn.addEventListener('click', submitParticipation);
  
  // URL API - замените на ваш реальный URL API
  const API_URL = 'https://your-api-url.com';
  
  // Инициализация интерфейса
  function initApp() {
    // В реальном приложении здесь будет вызов к API для получения статуса пользователя
    fetch(`${API_URL}/api/user-status/${userData.userId}`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          userData.walletConnected = data.data.wallet_connected;
          userData.walletAddress = data.data.wallet_address;
          userData.paymentCompleted = data.data.payment_completed;
          updateUI();
        }
      })
      .catch(error => {
        console.error('Ошибка получения статуса пользователя:', error);
      });
  }
  
  // Запуск приложения
  updateUI();
  initApp();
});
