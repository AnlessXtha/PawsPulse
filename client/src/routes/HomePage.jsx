import { Button } from "@/components/shadcn-components/ui/button";
import dogIMG from "@images/Cute_dog.jpg";

const HomePage = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-white ">
        <div className="px-[70px] flex flex-col md:flex-row items-center justify-between p-10">
          <div className="max-w-lg ">
            <h1 className="text-5xl font-bold text-gray-800">
              Welcome to PawPulse
            </h1>
            <p className="text-lg text-gray-600 mt-4">
              PawPulse is your one-stop pet care platform, offering seamless
              appointment booking, expert veterinary services, and a
              comprehensive EMR system to track your pet’s health.
            </p>
            <div className="mt-6 flex space-x-4">
              <Button className="bg-[#A63E4B] text-white px-6 py-3 rounded-lg hover:bg-[#8F2F3A]">
                Book an Appointment
              </Button>
              <Button className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300">
                Learn More
              </Button>
            </div>
          </div>
          <img
            src={dogIMG}
            alt="Cute Dog"
            className="w-80 h-80 object-cover rounded-full mt-6 md:mt-0"
          />
        </div>
      </section>

      {/* Our Services Section */}
      <section className="bg-[#D9AFAF] text-center p-12">
        <div className="px-[70px]">
          <h2 className="text-4xl font-semibold text-[#D56464]">
            Our Services
          </h2>
          <p className="text-lg text-gray-700 mt-4 ">
            From routine check-ups and preventive care to specialized treatments
            and emergency services, we provide top-notch veterinary care
            tailored to your pet’s unique needs, ensuring their health,
            happiness, and well-being at all times.
          </p>
          <Button className="mt-6 bg-[#A63E4B] text-white px-6 py-3 rounded-lg hover:bg-[#8F2F3A]">
            Learn More
          </Button>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white p-12">
        <h2 className="text-4xl font-semibold text-center text-gray-800">
          What Pet Owners Say
        </h2>
        <div className="flex flex-col md:flex-row justify-between mt-8">
          {[1, 2, 3].map((_, index) => (
            <div
              key={index}
              className="bg-gray-100 p-6 rounded-lg shadow-md w-full md:w-1/3 mx-2"
            >
              <p className="text-gray-700">
                "PawPulse has completely changed the way I care for my pet. The
                appointment booking is seamless!"
              </p>
              <div className="flex items-center mt-4">
                <img
                  src={dogIMG}
                  alt="User"
                  className="w-10 h-10 rounded-full mr-4"
                />
                <span className="text-gray-800 font-semibold">John Doe</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-[#D9AFAF] p-12 text-center">
        <h2 className="text-4xl font-semibold text-gray-800">Contact</h2>
        <p className="text-lg text-gray-700">Get in touch</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          {[
            { title: "Emergency", value: "+123 456 7890" },
            { title: "Location", value: "123 Pet Street, Paw City" },
            { title: "Email", value: "contact@pawpulse.com" },
            { title: "Working Hours", value: "Mon - Fri: 9am - 6pm" },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:bg-[#A63E4B] hover:text-white transition"
            >
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-lg">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-white text-center p-6">
        <p>&copy; 2025 PawPulse. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
