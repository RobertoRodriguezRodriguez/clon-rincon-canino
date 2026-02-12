import BookForm from "../../components/client-profile/book-form";

import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

import { DateRangePicker } from "rsuite";
import { Radio, RadioGroup, Form } from "rsuite";

const { beforeToday } = DateRangePicker;

export default function BookPage() {
  return (
    <>
      <Navbar />
      <div className="flex-grow">
      <div className="text-center sm:pt-24 pt-20">
        <Form.Group className="pt-4" controlId="radioList">
          <RadioGroup
            name="radioList"
            inline
            appearance="picker"
            defaultValue="A"
          >
            <Radio value="A">Clase individual</Radio>
            <Radio value="B">Clase grupal</Radio>
            <Radio value="C">Estancia</Radio>
          </RadioGroup>
        </Form.Group>

        <DateRangePicker
          showOneCalendar
          shouldDisableDate={beforeToday()}
          className="px-4 pt-7 w-full mx-auto max-w-screen-lg"
          size="lg"
          placeholder="Selecciona una fecha"
          format="dd.MM.yyyy"
        />
      </div>
      <BookForm />

      </div>
      <Footer />
    </>
  );
}
