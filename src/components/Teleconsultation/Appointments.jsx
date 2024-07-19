import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const Appointments = ({ doctor }) => {

  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  //Fetch appointments for a doctor
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { authToken } = JSON.parse(localStorage.getItem("user"));

        if (!authToken) {
          navigate('/login');
          return;
        }

        if (!doctor) {
          console.log("No doctor selected");
          return;
        }

        const response = await api.get(`/appointments?doctorId=${doctor.userId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        console.log(response.data.data.appointmentDetails);

        setAppointments(response.data.data.appointmentDetails);
      }
      catch (error) {
        console.error("Error fetching appointments for doctor", error);
      }
    }

    fetchAppointments();
  }, [doctor, navigate]);

  //Fetch patient details for an appointment
  useEffect(() => {
    const fetchPatient = async () => {
      if (selectedAppointment && selectedAppointment.patientId) {
        try {
          const { authToken } = JSON.parse(localStorage.getItem("user"));
          const response = await api.get(`/patients/${selectedAppointment.patientId}`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
  
          const patient = response.data.data;
          setSelectedAppointment(prevAppointment => ({
            ...prevAppointment,
            patient
          }));
        } catch (error) {
          console.error("Error fetching patient details:", error);
        }
      }
    };
  
    if (showModal && selectedAppointment && !selectedAppointment.patientName) {
      fetchPatient();
    }
  }, [selectedAppointment, showModal]);

  const handleViewAppointment = (appointmentId) => {
    const selected = appointments.find(appointment => appointment.appointmentId === appointmentId);
    setSelectedAppointment(selected);
    setShowModal(true);
  };

  return (
    <div className="container px-2">
      {/* <h1 className="text-2xl font-bold mb-4">Appointments</h1> */}
      {appointments.length > 0 ? (
      <table className="min-w-full border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            {/* <th className="px-4 py-2">ID</th> */}
            <th className="px-4 py-2">Date</th>
            {/* <th className="px-4 py-2">Patient Name</th> */}
            {/* <th className="px-4 py-2">Patient Id</th> */}
            <th className="px-4 py-2">Doctor Name</th>
            <th className="px-4 py-2">Start Date</th>
            <th className="px-4 py-2">End Date</th>
            <th className="px-4 py-2">Test Status</th>
            <th className="px-4 py-2">Appointment Type</th>
            <th className="px-4 py-2">Booking Amount</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.appointmentId} className="border-b border-gray-200">
              {/* <td className="px-5 py-2">{appointment.appointmentId}</td> */}
              <td className="px-5 py-2 text-sm">{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
              {/* <td className="px-5 py-2">{appointment.patientId}</td> */}
              <td className="px-5 py-2">{doctor.name}</td>
              <td className="px-5 py-2 text-sm">{new Date(appointment.appointmentStartTimeStamp).toLocaleString()}</td>
              <td className="px-5 py-2 text-sm">{new Date(appointment.appointmentEndTimeStamp).toLocaleString()}</td>
              <td className="px-5 py-2">{appointment.testStatus}</td>
              <td className="px-5 py-2">{appointment.appointmentType}</td>
              <td className="px-5 py-2">{appointment.bookingSummary.totalAmount}</td>
              <td className="px-5 py-2">
                <button
                  onClick={() => handleViewAppointment(appointment.appointmentId)}
                  className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      ) : (
        <p>No appointment data for the doctor.</p>
      )}

      {/* Modal for displaying appointment details */}
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-md">
            <h2 className="text-lg font-bold mb-4">Appointment Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="mb-2"><strong>Appointment ID:</strong> {selectedAppointment.appointmentId}</p>
                <p className="mb-2"><strong>Appointment Date:</strong> {new Date(selectedAppointment.appointmentDate).toLocaleString()}</p>
                <p className="mb-2"><strong>Appointment Schedule:</strong> {selectedAppointment.appointmentSchedule}</p>
                <p className="mb-2"><strong>Appointment Type:</strong> {selectedAppointment.appointmentType}</p>
                <p className="mb-2"><strong>Doctor ID:</strong> {selectedAppointment.doctorId}</p>
                <p className="mb-2"><strong>Gender:</strong> {selectedAppointment.gender}</p>
              </div>
              <div>
                <p className="mb-2"><strong>Patient ID:</strong> {selectedAppointment.patientId}</p>
                <p className="mb-2"><strong>Test Name:</strong> {selectedAppointment.testName}</p>
                <p className="mb-2"><strong>Test Status:</strong> {selectedAppointment.testStatus}</p>
                <p className="mb-2"><strong>Created At:</strong> {new Date(selectedAppointment.createdAt).toLocaleString()}</p>
                <p className="mb-2"><strong>Updated At:</strong> {new Date(selectedAppointment.updatedAt).toLocaleString()}</p>
              </div>
            </div>
            <div className="border-t border-gray-200 mt-4 pt-4">
              <h3 className="text-lg font-bold mb-2">Booking Summary</h3>
              <p><strong>Consultation Amount:</strong> {selectedAppointment.bookingSummary.consultationAmount}</p>
              <p><strong>Platform Charges:</strong> {selectedAppointment.bookingSummary.platformCharges}</p>
              <p><strong>Tax Amount:</strong> {selectedAppointment.bookingSummary.taxAmount}</p>
              <p><strong>Tax Percentage:</strong> {selectedAppointment.bookingSummary.taxPercentage}</p>
              <p><strong>Test Amount:</strong> {selectedAppointment.bookingSummary.testAmount}</p>
              <p><strong>Total Amount:</strong> {selectedAppointment.bookingSummary.totalAmount}</p>
              <p><strong>Total Charge:</strong> {selectedAppointment.bookingSummary.totalCharge}</p>
            </div>
            <button onClick={() => setShowModal(false)} className="mt-4 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Appointments;