import ContactInfo from "../components/contact/contact-info";
import ContactForm from "../components/contact/contact-form";

import Map from "../components/map";

import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <div className="max-w-screen-lg mx-auto">
        <ContactInfo />
        <Map />
        <ContactForm />
      </div>
      <Footer />
    </>
  );
}
