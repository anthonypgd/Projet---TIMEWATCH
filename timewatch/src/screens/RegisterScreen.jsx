import React from 'react';
import {ErrorMessage, Field, Form, Formik} from 'formik';
import {useNavigate} from 'react-router-dom';
import * as Yup from 'yup';

export default function RegisterScreen() {
    const navigate = useNavigate();


    return (
        <div className="flex items-center justify-center mt-14">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-700">Inscription</h2>
                <Formik
                    initialValues={{
                        username: '',
                        email: '',
                        password: '',
                        confirmPassword: ''
                    }}
                    onSubmit={async (values, { setSubmitting }) => {
                        try {
                            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    username: values.username,
                                    email: values.email,
                                    password: values.password
                                })
                            });
                            if (response.ok) {
                                navigate('/login');
                            } else {
                                const errorData = await response.json();
                                console.log('Erreur lors de l\'inscription:', errorData.message);
                                alert(errorData.message);
                            }
                        } catch (error) {
                            console.log(error.message);
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                    validationSchema={Yup.object({
                        username: Yup.string().required('Nom d\'utilisateur requis'),
                        email: Yup.string().email('Adresse email invalide').required('Email requis'),
                        password: Yup.string().required('Mot de passe requis'),
                        confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Les mots de passe doivent correspondre')
                    })}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-4">
                            <div className="form-group">
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nom
                                    d'utilisateur:</label>
                                <Field
                                    className="w-full px-3 py-2 mt-1 text-gray-700 border rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
                                    type="text"
                                    name="username"
                                    placeholder="Entrez votre nom d'utilisateur"
                                />
                                <ErrorMessage name="username" component="div" className="text-sm text-red-600 mt-1"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
                                <Field
                                    className="w-full px-3 py-2 mt-1 text-gray-700 border rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
                                    type="email"
                                    name="email"
                                    placeholder="Entrez votre email"
                                />
                                <ErrorMessage name="email" component="div" className="text-sm text-red-600 mt-1"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de
                                    passe:</label>
                                <Field
                                    className="w-full px-3 py-2 mt-1 text-gray-700 border rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
                                    type="password"
                                    name="password"
                                    placeholder="Entrez votre mot de passe"
                                />
                                <ErrorMessage name="password" component="div" className="text-sm text-red-600 mt-1"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmez le mot de passe:</label>
                                <Field
                                    className="w-full px-3 py-2 mt-1 text-gray-700 border rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirmez votre mot de passe"
                                />
                                <ErrorMessage name="confirmPassword" component="div" className="text-sm text-red-600 mt-1"/>
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full px-4 py-2 font-bold text-white bg-sky-500 rounded-md hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                                >
                                    {isSubmitting ? 'Inscription...' : 'S\'inscrire'}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}