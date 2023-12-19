import React from 'react'
import Header from '../../../Components/Header'
import Title from '../../../Components/Title'

const Admin = () => {
    return (
        <>
            <Header />
            <main className="min-h-screen flex flex-col items-center justify-center p-4">
                <section className="bg-white rounded-md text-slate-800 text-[17px] font-[500] shadow-md w-full max-w-[960px] relative mt-[140px] sm:mt-[100px] overflow-hidden">
                    <div className="drawer lg:drawer-open">
                        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                        <div className="drawer-content flex flex-col items-center justify-center">
                            {/* Page content here */}
                            <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">Open drawer</label>

                        </div>
                        <div className="drawer-side">
                            <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                            <ul className="menu sm:pt-[70px] p-4 w-80 min-h-full bg-base-200 text-base-content">
                                {/* Sidebar content here */}
                                <Link to="/admin/registrations">Registrations</Link>
                            </ul>

                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

export default Admin