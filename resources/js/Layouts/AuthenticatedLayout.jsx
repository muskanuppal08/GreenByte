import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
    const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en');
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [chatbotOpen, setChatbotOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([
        { sender: 'bot', text: '👋 Hello! I am your E-Waste assistant. Ask me how to recycle batteries, phones, laptops, or how points and badges work!' }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    
    // Translation dictionary
    const dictionary = {
        en: {
            dashboard: "Dashboard",
            locator: "Facility Locator",
            calculator: "Reward Calculator",
            leaderboard: "Leaderboard & Badges",
            pickups: "Home Pickups",
            assistant: "AI Assistant",
            impact: "Impact Dashboard",
            profile: "Profile",
            logout: "Log Out",
            welcome: "Welcome back",
            notifications: "Notifications",
            no_notifications: "No new notifications",
            mark_read: "Mark all as read",
            chatbot_title: "GreenByte Eco-Assistant",
            chatbot_placeholder: "Ask about recycling...",
            chatbot_send: "Send",
            theme_dark: "Dark Mode",
            theme_light: "Light Mode",
            lang_selector: "Language"
        },
        hi: {
            dashboard: "डैशबोर्ड",
            locator: "सुविधा लोकेटर",
            calculator: "पुरस्कार कैलकुलेटर",
            leaderboard: "लीडरबोर्ड और बैज",
            pickups: "होम पिकअप",
            assistant: "एआई सहायक",
            impact: "प्रभाव डैशबोर्ड",
            profile: "प्रोफ़ाइल",
            logout: "लॉग आउट",
            welcome: "आपका स्वागत है",
            notifications: "सूचनाएं",
            no_notifications: "कोई नई सूचना नहीं",
            mark_read: "सभी पढ़े हुए चिह्नित करें",
            chatbot_title: "ग्रीनबाइट इको-असिस्टेंट",
            chatbot_placeholder: "रिसाइकिलिंग के बारे में पूछें...",
            chatbot_send: "भेजें",
            theme_dark: "डार्क मोड",
            theme_light: "लाइट मोड",
            lang_selector: "भाषा"
        },
        es: {
            dashboard: "Panel",
            locator: "Buscador de Centros",
            calculator: "Calculadora de Premios",
            leaderboard: "Clasificación y Insignias",
            pickups: "Recogida a Domicilio",
            assistant: "Asistente AI",
            impact: "Panel de Impacto",
            profile: "Perfil",
            logout: "Cerrar Sesión",
            welcome: "Bienvenido de nuevo",
            notifications: "Notificaciones",
            no_notifications: "No hay notificaciones nuevas",
            mark_read: "Marcar todas como leídas",
            chatbot_title: "Asistente Ecológico GreenByte",
            chatbot_placeholder: "Pregunta sobre reciclaje...",
            chatbot_send: "Enviar",
            theme_dark: "Modo Oscuro",
            theme_light: "Modo Claro",
            lang_selector: "Idioma"
        }
    };

    const t = (key) => dictionary[lang]?.[key] || key;

    // Apply Theme
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Handle Language change
    const changeLang = (newLang) => {
        setLang(newLang);
        localStorage.setItem('lang', newLang);
    };

    // Fetch notifications
    const fetchNotifications = async () => {
        if (!user) return;
        try {
            const response = await axios.get(route('notifications.index'));
            setNotifications(response.data);
        } catch (err) {
            console.error("Failed to load notifications", err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [user]);

    const markNotificationAsRead = async (id) => {
        try {
            await axios.post(route('notifications.read', id));
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (err) {
            console.error(err);
        }
    };

    const deleteNotification = async (id) => {
        try {
            await axios.delete(route('notifications.destroy', id));
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const markAllRead = async () => {
        const unread = notifications.filter(n => !n.is_read);
        for (let n of unread) {
            await markNotificationAsRead(n.id);
        }
    };

    // Send Chatbot message
    const handleSendChat = async (e) => {
        if (e) e.preventDefault();
        if (!chatInput.trim()) return;

        const userMsg = chatInput;
        setChatInput('');
        setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setChatLoading(true);

        try {
            const response = await axios.post(route('chatbot.chat'), { message: userMsg });
            setChatMessages(prev => [...prev, { sender: 'bot', text: response.data.response }]);
        } catch (err) {
            console.error(err);
            setChatMessages(prev => [...prev, { sender: 'bot', text: "Sorry, I encountered an error connecting to my core brain. Please try again!" }]);
        } finally {
            setChatLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-slate-950 transition-colors duration-200">
            <nav className="border-b border-gray-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 transition-colors duration-200">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-emerald-500" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                    className="dark:text-slate-350 dark:hover:text-white"
                                >
                                    {t('dashboard')}
                                </NavLink>
                                
                                {user?.role === 'admin' && (
                                    <>
                                        <NavLink
                                            href={route('admin.facilities.index')}
                                            active={route().current('admin.facilities.*')}
                                            className="dark:text-slate-350 dark:hover:text-white"
                                        >
                                            {dictionary[lang]?.manage_facilities || 'Manage Facilities'}
                                        </NavLink>
                                        <NavLink
                                            href={route('admin.reviews.index')}
                                            active={route().current('admin.reviews.index')}
                                            className="dark:text-slate-350 dark:hover:text-white"
                                        >
                                            {dictionary[lang]?.manage_reviews || 'Manage Reviews'}
                                        </NavLink>
                                        <NavLink
                                            href={route('admin.pickups.index')}
                                            active={route().current('admin.pickups.*')}
                                            className="dark:text-slate-350 dark:hover:text-white"
                                        >
                                            {dictionary[lang]?.manage_pickups || 'Manage Pickups'}
                                        </NavLink>
                                        <NavLink
                                            href={route('admin.users.index')}
                                            active={route().current('admin.users.*')}
                                            className="dark:text-slate-350 dark:hover:text-white"
                                        >
                                            {dictionary[lang]?.manage_users || 'Manage Users'}
                                        </NavLink>
                                        <NavLink
                                            href={route('admin.education.index')}
                                            active={route().current('admin.education.*')}
                                            className="dark:text-slate-350 dark:hover:text-white"
                                        >
                                            {dictionary[lang]?.manage_education || 'Manage Education'}
                                        </NavLink>
                                        <NavLink
                                            href={route('admin.reports.index')}
                                            active={route().current('admin.reports.*')}
                                            className="dark:text-slate-350 dark:hover:text-white"
                                        >
                                            {dictionary[lang]?.system_reports || 'System Reports'}
                                        </NavLink>
                                        <NavLink
                                            href={route('admin.analytics.index')}
                                            active={route().current('admin.analytics.*')}
                                            className="dark:text-slate-350 dark:hover:text-white"
                                        >
                                            {dictionary[lang]?.platform_analytics || 'Platform Analytics'}
                                        </NavLink>
                                    </>
                                )}

                                {user?.role === 'user' && (
                                    <>
                                        <NavLink
                                            href={route('calculator')}
                                            active={route().current('calculator')}
                                            className="dark:text-slate-350 dark:hover:text-white"
                                        >
                                            {t('calculator')}
                                        </NavLink>
                                        <NavLink
                                            href={route('leaderboard')}
                                            active={route().current('leaderboard')}
                                            className="dark:text-slate-350 dark:hover:text-white"
                                        >
                                            {t('leaderboard')}
                                        </NavLink>
                                        <NavLink
                                            href={route('pickups.index')}
                                            active={route().current('pickups.*')}
                                            className="dark:text-slate-350 dark:hover:text-white"
                                        >
                                            {t('pickups')}
                                        </NavLink>
                                        <NavLink
                                            href={route('recommendations.index')}
                                            active={route().current('recommendations.*')}
                                            className="dark:text-slate-350 dark:hover:text-white"
                                        >
                                            {t('assistant')}
                                        </NavLink>
                                        <NavLink
                                            href={route('impact.index')}
                                            active={route().current('impact.*')}
                                            className="dark:text-slate-350 dark:hover:text-white"
                                        >
                                            {t('impact')}
                                        </NavLink>
                                    </>
                                )}

                                <NavLink
                                    href={route('locator')}
                                    active={route().current('locator')}
                                    className="dark:text-slate-350 dark:hover:text-white"
                                >
                                    {t('locator')}
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center space-x-4">
                            {/* Language Dropdown */}
                            <div className="relative">
                                <select
                                    value={lang}
                                    onChange={(e) => changeLang(e.target.value)}
                                    className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-1.5 focus:ring-emerald-500 focus:border-emerald-500 text-slate-750 dark:text-slate-200 font-bold focus:outline-none"
                                >
                                    <option value="en">🇬🇧 EN</option>
                                    <option value="hi">🇮🇳 HI</option>
                                    <option value="es">🇪🇸 ES</option>
                                </select>
                            </div>

                            {/* Dark Mode Toggle */}
                            <button
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl transition-all hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none"
                                title={theme === 'dark' ? t('theme_light') : t('theme_dark')}
                            >
                                {theme === 'dark' ? '☀️' : '🌙'}
                            </button>

                            {/* Notifications Drawer */}
                            {user && (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowNotifications(!showNotifications)}
                                        className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl relative transition-all hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none"
                                    >
                                        🔔
                                        {notifications.filter(n => !n.is_read).length > 0 && (
                                            <span className="absolute top-1.5 right-1.5 bg-rose-500 text-white rounded-full text-[8px] font-black h-4 w-4 flex items-center justify-center animate-pulse">
                                                {notifications.filter(n => !n.is_read).length}
                                            </span>
                                        )}
                                    </button>

                                    {showNotifications && (
                                        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-4 space-y-3">
                                            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                                                <h5 className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-wider">{t('notifications')}</h5>
                                                {notifications.filter(n => !n.is_read).length > 0 && (
                                                    <button
                                                        onClick={markAllRead}
                                                        className="text-[9px] font-bold text-emerald-600 hover:text-emerald-700 uppercase"
                                                    >
                                                        {t('mark_read')}
                                                    </button>
                                                )}
                                            </div>

                                            <div className="max-h-60 overflow-y-auto space-y-2.5">
                                                {notifications.length > 0 ? (
                                                    notifications.map((n) => (
                                                        <div
                                                            key={n.id}
                                                            className={`p-2.5 rounded-xl border text-xs flex justify-between gap-2 relative ${
                                                                n.is_read 
                                                                    ? 'bg-slate-50/50 border-slate-100 dark:bg-slate-900/40 dark:border-slate-800/50 opacity-60' 
                                                                    : 'bg-emerald-500/5 border-emerald-500/10 dark:bg-emerald-500/10'
                                                            }`}
                                                        >
                                                            <div className="space-y-0.5 cursor-pointer flex-1 text-left" onClick={() => markNotificationAsRead(n.id)}>
                                                                <p className="font-extrabold text-slate-800 dark:text-slate-200">{n.title}</p>
                                                                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">{n.message}</p>
                                                            </div>
                                                            <button
                                                                onClick={() => deleteNotification(n.id)}
                                                                className="text-slate-400 hover:text-rose-500 self-start p-0.5 transition-all focus:outline-none"
                                                            >
                                                                🗑️
                                                            </button>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-[10px] text-slate-400 text-center py-4">{t('no_notifications')}</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="relative ms-3">
                                {user ? (
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center rounded-md border border-transparent bg-white dark:bg-slate-900 px-3 py-2 text-sm font-medium leading-4 text-gray-500 dark:text-slate-350 transition duration-150 ease-in-out hover:text-gray-700 dark:hover:text-white focus:outline-none"
                                                >
                                                    {user.name}

                                                    <svg
                                                        className="-me-0.5 ms-2 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Link
                                                href={route('profile.edit')}
                                            >
                                                {t('profile')}
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                            >
                                                {t('logout')}
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                ) : (
                                    <div className="space-x-4">
                                        <Link
                                            href={route('login')}
                                            className="text-sm text-gray-750 dark:text-gray-400 hover:underline"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="ml-4 text-sm text-gray-750 dark:text-gray-400 hover:underline"
                                        >
                                            Register
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            {t('dashboard')}
                        </ResponsiveNavLink>

                        {user?.role === 'admin' && (
                            <>
                                <ResponsiveNavLink
                                    href={route('admin.facilities.index')}
                                    active={route().current('admin.facilities.*')}
                                >
                                    {dictionary[lang]?.manage_facilities || 'Manage Facilities'}
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('admin.reviews.index')}
                                    active={route().current('admin.reviews.index')}
                                >
                                    {dictionary[lang]?.manage_reviews || 'Manage Reviews'}
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('admin.pickups.index')}
                                    active={route().current('admin.pickups.index')}
                                >
                                    {dictionary[lang]?.manage_pickups || 'Manage Pickups'}
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('admin.users.index')}
                                    active={route().current('admin.users.index')}
                                >
                                    {dictionary[lang]?.manage_users || 'Manage Users'}
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('admin.education.index')}
                                    active={route().current('admin.education.index')}
                                >
                                    {dictionary[lang]?.manage_education || 'Manage Education'}
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('admin.reports.index')}
                                    active={route().current('admin.reports.index')}
                                >
                                    {dictionary[lang]?.system_reports || 'System Reports'}
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('admin.analytics.index')}
                                    active={route().current('admin.analytics.index')}
                                >
                                    {dictionary[lang]?.platform_analytics || 'Platform Analytics'}
                                </ResponsiveNavLink>
                            </>
                        )}

                        {user?.role === 'user' && (
                             <>
                                 <ResponsiveNavLink
                                     href={route('calculator')}
                                     active={route().current('calculator')}
                                 >
                                     {t('calculator')}
                                 </ResponsiveNavLink>
                                 <ResponsiveNavLink
                                     href={route('leaderboard')}
                                     active={route().current('leaderboard')}
                                 >
                                     {t('leaderboard')}
                                 </ResponsiveNavLink>
                                 <ResponsiveNavLink
                                     href={route('pickups.index')}
                                     active={route().current('pickups.index')}
                                 >
                                     {t('pickups')}
                                 </ResponsiveNavLink>
                                 <ResponsiveNavLink
                                     href={route('recommendations.index')}
                                     active={route().current('recommendations.index')}
                                 >
                                     {t('assistant')}
                                 </ResponsiveNavLink>
                                 <ResponsiveNavLink
                                     href={route('impact.index')}
                                     active={route().current('impact.index')}
                                 >
                                     {t('impact')}
                                 </ResponsiveNavLink>
                             </>
                        )}

                        <ResponsiveNavLink
                            href={route('locator')}
                            active={route().current('locator')}
                        >
                            {t('locator')}
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        {user ? (
                            <>
                                <div className="px-4">
                                    <div className="text-base font-medium text-gray-800 dark:text-white">
                                        {user.name}
                                    </div>
                                    <div className="text-sm font-medium text-gray-500 dark:text-slate-400">
                                        {user.email}
                                    </div>
                                </div>

                                <div className="mt-3 space-y-1">
                                    <ResponsiveNavLink href={route('profile.edit')}>
                                        {t('profile')}
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink
                                        method="post"
                                        href={route('logout')}
                                        as="button"
                                    >
                                        {t('logout')}
                                    </ResponsiveNavLink>
                                </div>
                            </>
                        ) : (
                            <div className="mt-3 space-y-1 px-4">
                                <Link
                                    href={route('login')}
                                    className="block text-base font-medium text-gray-500 hover:text-gray-850 dark:text-gray-400"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="block text-base font-medium text-gray-500 hover:text-gray-850 dark:text-gray-400"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white dark:bg-slate-900 shadow transition-colors duration-200">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>

            {/* AI Chatbot Floating Button & Panel */}
            <div className="fixed bottom-6 right-6 z-45 no-print">
                <button
                    onClick={() => setChatbotOpen(!chatbotOpen)}
                    className="h-14 w-14 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 focus:outline-none"
                    title={t('chatbot_title')}
                >
                    {chatbotOpen ? (
                        <span className="text-xl font-bold">✕</span>
                    ) : (
                        <span className="text-2xl">💬</span>
                    )}
                </button>

                {chatbotOpen && (
                    <div className="absolute bottom-16 right-0 w-80 max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[400px] transition-all duration-300">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 text-white flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">🤖</span>
                                <div className="text-left">
                                    <h5 className="text-[10px] font-black uppercase tracking-wider">{t('chatbot_title')}</h5>
                                    <p className="text-[8px] text-emerald-200 font-bold uppercase tracking-wide">Green Assistant</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-200">
                            {chatMessages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl text-xs whitespace-pre-line leading-relaxed text-left ${
                                            msg.sender === 'user'
                                                ? 'bg-emerald-600 text-white rounded-tr-none'
                                                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-250 rounded-tl-none border border-slate-100 dark:border-slate-850 shadow-sm'
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {chatLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-850 text-xs text-slate-400 flex items-center space-x-1 shadow-sm">
                                        <div className="animate-bounce font-black">●</div>
                                        <div className="animate-bounce [animation-delay:0.2s] font-black">●</div>
                                        <div className="animate-bounce [animation-delay:0.4s] font-black">●</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Footer */}
                        <form onSubmit={handleSendChat} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-850 flex gap-2">
                            <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                placeholder={t('chatbot_placeholder')}
                                className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800 dark:text-white"
                                required
                            />
                            <button
                                type="submit"
                                disabled={chatLoading}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-40"
                            >
                                {t('chatbot_send')}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
