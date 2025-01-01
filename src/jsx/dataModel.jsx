//struktur belom di cocokin sama firebase, lagi mau di buat

const productsData = [
    { id: "prod1", name: 'Apel Merah', weight: '1kg', price: 'Rp.45000', rating: '4.5', image: '/images/apple-green.jpg', desc: "Apel Merah segar dengan rasa manis yang khas", storeName: "Pak Joko Garden" },
    { id: "prod2", name: 'Apel Kuning', weight: '1kg', price: 'Rp.50000', rating: '4.7', image: '/images/apple-green.jpg', desc: "Apel Kuning segar, sangat cocok untuk jus", storeName: "Toko Buah Sehat" },
    { id: "prod3", name: 'Apel Hijau', weight: '1kg', price: 'Rp.55000', rating: '4.8', image: '/images/apple-green.jpg', desc: "Apel Hijau dengan rasa asam manis yang segar", storeName: "Toko Buah Organik" },
    { id: "prod4", name: 'Apel Biru', weight: '1kg', price: 'Rp.60000', rating: '4.9', image: '/images/apple-green.jpg', desc: "Apel Biru langka dengan rasa yang unik", storeName: "Pak Joko Garden" },
    { id: "prod5", name: 'Apel Ungu', weight: '1kg', price: 'Rp.48000', rating: '4.6', image: '/images/apple-green.jpg', desc: "Apel Ungu yang kaya akan vitamin", storeName: "Toko Buah Sehat" },
    { id: "prod6", name: 'Apel Hitam', weight: '1kg', price: 'Rp.70000', rating: '5.0', image: '/images/apple-green.jpg', desc: "Apel Hitam dengan tekstur lembut dan rasa yang khas", storeName: "Toko Buah Organik" },
    { id: "prod7", name: 'Apel Fuji', weight: '1kg', price: 'Rp.55000', rating: '4.7', image: '/images/apple-green.jpg', desc: "Apel Fuji dengan rasa manis dan segar", storeName: "Pak Joko Garden" },
    { id: "prod8", name: 'Apel Pink Lady', weight: '1kg', price: 'Rp.60000', rating: '4.9', image: '/images/apple-green.jpg', desc: "Apel Pink Lady dengan keseimbangan manis dan asam", storeName: "Toko Buah Sehat" },
    { id: "prod9", name: 'Apel Gala', weight: '1kg', price: 'Rp.55000', rating: '4.8', image: '/images/apple-green.jpg', desc: "Apel Gala yang segar dan manis", storeName: "Toko Buah Organik" },
    { id: "prod10", name: 'Apel Braeburn', weight: '1kg', price: 'Rp.58000', rating: '4.6', image: '/images/apple-green.jpg', desc: "Apel Braeburn dengan rasa asam dan manis yang tajam", storeName: "Pak Joko Garden" },
    { id: "prod11", name: 'Apel Golden Delicious', weight: '1kg', price: 'Rp.52000', rating: '4.7', image: '/images/apple-green.jpg', desc: "Apel Golden Delicious dengan rasa manis yang lembut", storeName: "Toko Buah Sehat" },
    { id: "prod12", name: 'Apel Empire', weight: '1kg', price: 'Rp.60000', rating: '4.8', image: '/images/apple-green.jpg', desc: "Apel Empire yang kaya rasa dengan tekstur yang renyah", storeName: "Toko Buah Organik" },
    { id: "prod13", name: 'Apel Jonagold', weight: '1kg', price: 'Rp.57000', rating: '4.6', image: '/images/apple-green.jpg', desc: "Apel Jonagold dengan campuran rasa manis dan asam", storeName: "Pak Joko Garden" },
    { id: "prod14", name: 'Apel Opal', weight: '1kg', price: 'Rp.63000', rating: '4.9', image: '/images/apple-green.jpg', desc: "Apel Opal yang memiliki rasa manis segar", storeName: "Toko Buah Sehat" },
    { id: "prod15", name: 'Apel Sweet Tango', weight: '1kg', price: 'Rp.65000', rating: '5.0', image: '/images/apple-green.jpg', desc: "Apel Sweet Tango dengan rasa yang sangat manis dan segar", storeName: "Toko Buah Organik" },
    { id: "prod16", name: 'Apel Cripps Pink', weight: '1kg', price: 'Rp.59000', rating: '4.7', image: '/images/apple-green.jpg', desc: "Apel Cripps Pink yang terkenal dengan rasa asam manisnya", storeName: "Pak Joko Garden" },
];

const storesData = [
    { name: 'Pak Joko Garden', category: 'Buah dan Sayuran', rating: '#4.6', storeId: "store1" },
    { name: 'Toko Buah Sehat', category: 'Segar dan Organik', rating: '#4.7', storeId: "store2" },
    { name: 'Toko Buah Organik', category: 'Segar dan Organik', rating: '#4.8', storeId: "store3" },
    { name: 'Toko Buah Premium', category: 'Buah Berkualitas', rating: '#5.0', storeId: "store4" },
    { name: 'Pak Joko Garden', category: 'Buah dan Sayuran', rating: '#4.6', storeId: "store5" },
];

const notificationsData = [
    { id: 1, title: "Pesanan Diproses", message: "Pesanan Anda sedang diproses dan akan segera dikirim.", timestamp: "2025-01-01 09:00", isRead: false, type: "order" },
    { id: 2, title: "Diskon Spesial", message: "Dapatkan diskon 20% untuk produk buah segar hari ini!", timestamp: "2025-01-01 08:30", isRead: false, type: "promo" },
    { id: 3, title: "Pembayaran Berhasil", message: "Pembayaran Anda telah diterima. Terima kasih telah berbelanja!", timestamp: "2025-01-01 08:00", isRead: true, type: "payment" },
    { id: 4, title: "Pengiriman Dimulai", message: "Pesanan Anda sedang dalam perjalanan ke lokasi Anda.", timestamp: "2024-12-31 18:45", isRead: false, type: "delivery" },
    { id: 5, title: "Pesanan Diterima", message: "Pesanan Anda telah diterima. Semoga Anda puas dengan produk kami!", timestamp: "2024-12-31 17:30", isRead: true, type: "order" },
    { id: 6, title: "Notifikasi Sistem", message: "Sistem akan diperbarui pada 2 Januari pukul 03.00 WIB.", timestamp: "2024-12-30 15:00", isRead: true, type: "system" },
    { id: 7, title: "Pengingat Promo", message: "Promo akhir tahun akan segera berakhir! Jangan sampai terlewat.", timestamp: "2024-12-30 10:00", isRead: false, type: "promo" },
    { id: 8, title: "Ulasan Produk", message: "Berikan ulasan Anda untuk pesanan terbaru dan dapatkan poin reward!", timestamp: "2024-12-29 12:30", isRead: true, type: "feedback" },
    { id: 9, title: "Poin Reward", message: "Anda mendapatkan 50 poin reward atas pembelian terbaru Anda.", timestamp: "2024-12-29 10:00", isRead: false, type: "reward" },
    { id: 10, title: "Produk Baru", message: "Produk apel Fuji baru saja tersedia di toko kami!", timestamp: "2024-12-28 14:15", isRead: true, type: "product" },
    { id: 11, title: "Pesanan Gagal", message: "Pesanan Anda gagal diproses karena masalah pembayaran.", timestamp: "2024-12-27 16:00", isRead: true, type: "error" },
    { id: 12, title: "Voucher Anda", message: "Anda memiliki voucher Rp50.000 yang akan segera kadaluarsa.", timestamp: "2024-12-27 08:45", isRead: false, type: "voucher" },
    { id: 13, title: "Selamat Tahun Baru!", message: "Semoga tahun baru ini membawa kebahagiaan dan kesuksesan untuk Anda.", timestamp: "2025-01-01 00:00", isRead: true, type: "greeting" },
    { id: 14, title: "Cek Ongkir", message: "Gratis ongkir untuk pembelian di atas Rp200.000 hari ini saja!", timestamp: "2024-12-26 09:00", isRead: false, type: "promo" },
    { id: 15, title: "Pesanan Dibatalkan", message: "Pesanan Anda telah dibatalkan sesuai permintaan.", timestamp: "2024-12-25 18:00", isRead: true, type: "order" }
];

const chatDataHome = [
    { id: "chatId1", name: "Joko Kendi", message: "Pak barangnya masih ready kalau mau pesan", unreadCount: 1, lastMessageTime: "09-08-2025", chatType: "personal" },
    { id: "chatId2", name: "Joko Kendi", message: "Pak barangnya masih ready kalau mau pesan", unreadCount: 1, lastMessageTime: "09-08-2025", chatType: "personal" },
    { id: "chatId3", name: "Joko Kendi", message: "Pak barangnya masih ready kalau mau pesan", unreadCount: 1, lastMessageTime: "09-08-2025", chatType: "personal" },
    { id: "chatId4", name: "Joko Kendi", message: "Pak barangnya masih ready kalau mau pesan", unreadCount: 1, lastMessageTime: "09-08-2025", chatType: "personal" },
    { id: "chatId5", name: "Joko Kendi", message: "Pak barangnya masih ready kalau mau pesan", unreadCount: 1, lastMessageTime: "09-08-2025", chatType: "personal" },
    { id: "chatId6", name: "Joko Kendi", message: "Pak barangnya masih ready kalau mau pesan", unreadCount: 1, lastMessageTime: "09-08-2025", chatType: "personal" },
    { id: "chatId7", name: "Joko Kendi", message: "Pak barangnya masih ready kalau mau pesan", unreadCount: 1, lastMessageTime: "09-08-2025", chatType: "personal" },
    { id: "chatId8", name: "Joko Kendi", message: "Pak barangnya masih ready kalau mau pesan", unreadCount: 1, lastMessageTime: "09-08-2025", chatType: "discuss" },
    { id: "chatId9", name: "Joko Kendi", message: "Pak barangnya masih ready kalau mau pesan", unreadCount: 1, lastMessageTime: "09-08-2025", chatType: "discuss" },
    { id: "chatId10", name: "Joko Kendi", message: "Pak barangnya masih ready kalau mau pesan", unreadCount: 1, lastMessageTime: "09-08-2025", chatType: "discuss" },
    { id: "chatId11", name: "Joko Kendi", message: "Pak barangnya masih ready kalau mau pesan", unreadCount: 1, lastMessageTime: "09-08-2025", chatType: "discuss" },
    { id: "chatId12", name: "Joko Kendi", message: "Pak barangnya masih ready kalau mau pesan", unreadCount: 1, lastMessageTime: "09-08-2025", chatType: "discuss" },
    { id: "chatId13", name: "Joko Kendi", message: "Pak barangnya masih ready kalau mau pesan", unreadCount: 1, lastMessageTime: "09-08-2025", chatType: "discuss" },
    { id: "chatId14", name: "Joko Kendi", message: "Pak barangnya masih ready kalau mau pesan", unreadCount: 1, lastMessageTime: "09-08-2025", chatType: "discuss" },
];

const chattingData = [
    { id: 1, senderId: "userId2",isRead: true, message: "Halo, apakah barangnya masih ada?", time: "08:10 AM" },
    { id: 2, senderId: "userId1", isRead: true,message: "Halo, Pak Joko. Ya, barangnya masih tersedia.", time: "08:12 AM" },
    { id: 3, senderId: "userId2",isRead: true, message: "Oke, saya pesan 2 unit. Bagaimana cara pembayarannya?", time: "08:15 AM" },
    { id: 4, senderId: "userId1", isRead: true,message: "Silakan transfer ke rekening BCA kami, lalu konfirmasi pembayaran.", time: "08:18 AM" },
    { id: 5, senderId: "userId2",isRead: true, message: "Baik, nanti saya kabari setelah transfer.", time: "08:20 AM" },
    { id: 6, senderId: "userId1", isRead: true,message: "Baik, Pak. Terima kasih.", time: "08:22 AM" },
    { id: 7, senderId: "userId2",isRead: true, message: "Saya sudah transfer, tolong cek ya.", time: "09:00 AM" },
    { id: 8, senderId: "userId1", isRead: true,message: "Pembayaran sudah kami terima. Akan segera kami kirim hari ini.", time: "09:10 AM" },
    { id: 9, senderId: "userId1",isRead: false, message: "Terima kasih", time: "09:12 AM" },
];

export { productsData, storesData, notificationsData, chatDataHome, chattingData }
