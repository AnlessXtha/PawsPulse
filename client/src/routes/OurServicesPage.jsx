import dogIMG from "@images/Cute_dog.jpg";
import { Button } from "@/components/shadcn-components/ui/button";

const OurServicesPage = () => {
  return (
    <div>
      <h1>Our Services Page</h1>
      <img src={dogIMG} alt="" />
      <Button>Wow</Button>
    </div>
  );
};

export default OurServicesPage;
