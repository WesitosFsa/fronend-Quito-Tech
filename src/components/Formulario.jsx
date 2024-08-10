import { useContext, useState } from "react"
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import Mensaje from './Alertas';

export const Formulario = ({ tienda }) => {

    const navigate = useNavigate();
    const [mensaje, setMensaje] = useState({});

    const [form, setform] = useState({
        Nombre_tienda: tienda?.Nombre_tienda ?? "",
        Direccion: tienda?.Direccion ?? "",
        email: tienda?.email ?? "",
        userId: localStorage.getItem('id_usuario') || ""
    });

    const handleChange = (e) => {
        setform({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(form);

        try {
            const token = localStorage.getItem('token');
            const url = `${import.meta.env.VITE_BACKEND_URL}/usuario/solicitud/`;
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };

            if (tienda?._id) {
                await axios.put(url, form, options);
                navigate('/dashboard/listar');
            } else {
                await axios.post(url, form, options);
                setMensaje({ respuesta: "La solicitud fue enviada, pronto recibirás una notificación", tipo: true });
            }
        } catch (error) {
            console.log(error);
            setMensaje({ respuesta: "Hubo un error al enviar la solicitud", tipo: false });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {Object.keys(mensaje).length > 0 && <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>}
            <div>
                <label htmlFor='Nombre_tienda' className='text-slate-400 uppercase font-bold text-sm'>Nombre de la Tienda: </label>
                <input
                    id='Nombre_tienda'
                    type="text"
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
                    placeholder='nombre de tu tienda'
                    name='Nombre_tienda'
                    value={form.Nombre_tienda}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor='Direccion' className='text-slate-400 uppercase font-bold text-sm'>Dirección de la tienda: </label>
                <input
                    id='Direccion'
                    type="text"
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
                    placeholder='Dirección de la tienda'
                    name='Direccion'
                    value={form.Direccion}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor='email' className='text-slate-400 uppercase font-bold text-sm'>Email de confirmación: </label>
                <input
                    id='email'
                    type="email"
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
                    placeholder='Email@registrado.com'
                    name='email'
                    value={form.email}
                    onChange={handleChange}
                />
            </div>
            <input
                type="submit"
                className='bg-purple-500 w-full p-3 
                    text-slate-300 uppercase font-bold rounded-lg 
                    hover:bg-gray-900 cursor-pointer transition-all'
                value={tienda?._id ? 'Actualizar Tienda' : 'Mandar solicitud de tienda'}
            />
        </form>
    );
};
