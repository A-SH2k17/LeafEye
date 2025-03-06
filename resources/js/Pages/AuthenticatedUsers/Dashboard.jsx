import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/multilanguage';
import { useEffect } from 'react';

export default function Dashboard() {

    //multilangiage code
    const {lang,handleChange,languages} = useLanguage();
    const {t} = useTranslation();

    return (
        <AuthenticatedLayout
            lang={lang}>
            <Head title={t("home_link")} />
            <select value={lang} onChange={handleChange} className='m-4'>
                    {languages.map((item) => {
                        return (
                            <option
                                key={item.value}
                                value={item.value}
                            >
                                {item.text}
                            </option>
                        );
                    })}
                </select>
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            You're logged in!
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
