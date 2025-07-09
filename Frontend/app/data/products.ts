import { Product, Supplier } from "../types/index";

export const products: Product[] = [
  {
    id: "1",
    name: "Hydraulics and Pumps",
    category: "Industrial Equipment",
    description:
      "Designed to deliver high power and efficiency, these pumps are ideal for heavy-duty industrial operations requiring consistent high-pressure output.",
    image: "https://images.pexels.com/photos/3807319/pexels-photo-3807319.jpeg",
    price: "$150‑3000/unit",
    rating: 4.8,
    reviews: 156,
  },
  {
    id: "9",
    name: "Electrical and Electronic Components",
    category: "Electronics",
    description:
      "Essential passive and active components used in electronic systems for signal regulation, energy storage, and circuit functionality. ",
    image:
      "https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=800",
    price: "$0.5‑50/unit",
    rating: 4.9,
    reviews: 203,
  },
  {
    id: "2",
    name: "Lighting Systems",
    category: "Lighting",
    description:
      "Energy-efficient LED panels and intelligent lighting systems designed for modern spaces, offering customizable brightness, automation, and long-term cost savings.",
    image:
      "https://images.pexels.com/photos/1036936/pexels-photo-1036936.jpeg?auto=compress&cs=tinysrgb&w=800",
    price: "$12‑250/unit",
    rating: 4.7,
    reviews: 89,
  },
  {
    id: "3",
    name: "Oils, Lubricants and Coolants",
    category: "Automotive",
    description:
      "High-performance engine oils and industrial coolants engineered to ensure optimal thermal management under extreme conditions.",
    image:
      "https://images.pexels.com/photos/13065694/pexels-photo-13065694.jpeg",
    price: "$15‑120/liter",
    rating: 4.6,
    reviews: 134,
  },
  {
    id: "4",
    name: "Transmissions and Gearboxes",
    category: "Automotive",
    description:
      "Precision-engineered gearboxes and transmission units designed to ensure smooth power delivery, optimal torque conversion, and reliable vehicle performance.",
    image:
      "https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=800",
    price: "$500‑5000/unit",
    rating: 4.9,
    reviews: 67,
  },
  {
    id: "5",
    name: "Vehicle Chassis and Body Parts",
    category: "Automotive",
    description:
      "Durable and lightweight chassis frames and body panels crafted to meet structural integrity, safety, and aerodynamic standards in modern vehicles.",
    image:
      "https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg?auto=compress&cs=tinysrgb&w=800",
    price: "$300‑5000/part",
    rating: 4.8,
    reviews: 298,
  },
  {
    id: "6",
    name: "Wiring Harness",
    category: "Electrical",
    description:
      "Custom-built wiring harnesses for automotive and industrial applications, ensuring efficient power distribution, signal integrity, and system reliability.",
    image: "https://images.pexels.com/photos/2332885/pexels-photo-2332885.jpeg",
    price: "$0.25‑2.50/unit",
    rating: 4.5,
    reviews: 445,
  },
  {
    id: "7",
    name: "Batteries",
    category: "Energy",
    description:
      "Advanced lithium-ion and lead-acid batteries offering reliable energy storage for automotive, industrial, and backup power applications.",
    image:
      "https://images.pexels.com/photos/110844/pexels-photo-110844.jpeg?auto=compress&cs=tinysrgb&w=800",
    price: "$25‑200/unit",
    rating: 4.7,
    reviews: 178,
  },
  {
    id: "8",
    name: "Composite and Lightweight Material",
    category: "Materials",
    description:
      "Carbon‑fiber composite panels and lightweight materials for enhanced structural efficiency. Ideal for automotive applications seeking strength-to-weight optimization.",
    image:
      "https://www.pukkapartners.com/media/2021/5/30e7cc5a-e017-4cd6-89f5-8c2a4dfcc94d.jpg",
    price: "$500‑2500/unit",
    rating: 4.6,
    reviews: 92,
  },
  {
    id: "10",
    name: "Electrical Vehicle Components",
    category: "Electric Vehicles",
    description:
      "EV motors and controller kits engineered for electric vehicle powertrains. Supports high-efficiency energy conversion and smart mobility systems.",
    image:
      "https://www.ultralibrarian.com/wp-content/uploads/2023/11/Examples-of-electromechanical-components-in-electric-vehicles.jpg",
    price: "$50‑3000/kit",
    rating: 4.4,
    reviews: 267,
  },
  {
    id: "11",
    name: "Engines",
    category: "Automotive",
    description:
      "Petrol, diesel, and hybrid engines designed for performance across automotive applications. Built to meet emission standards and deliver reliable power output.",
    image:
      "https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=800",
    price: "$1000‑10000/unit",
    rating: 4.7,
    reviews: 156,
  },
  {
    id: "12",
    name: "Glass and Optical Materials",
    category: "Materials",
    description:
      "High-precision optical glass and lens materials for industrial and imaging uses. Suitable for sensors, cameras, and high-clarity display technologies.",
    image:
      "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800",
    price: "$10‑150/piece",
    rating: 4.8,
    reviews: 324,
  },
  {
    id: "13",
    name: "Paints Coatings and Surface Treatments",
    category: "Chemicals",
    description:
      "Protective industrial coatings and advanced surface treatments for durability and aesthetics. Designed for corrosion resistance and protection.",
    image:
      "https://www.kellertechnology.com/wp-content/uploads/2018/10/Surface-Treatments-Fanuc-Painting-Robot.jpg",
    price: "$50‑500/liter",
    rating: 4.9,
    reviews: 78,
  },
  {
    id: "14",
    name: "Plastic and Polymer Parts",
    category: "Plastics",
    description:
      "Injection‑molded plastic components and engineered polymer parts for versatile manufacturing. Used in electronics, automotive interiors, and consumer goods.",
    image:
      "https://images.pexels.com/photos/31115985/pexels-photo-31115985.jpeg",
    price: "$1.2‑3.5/kg",
    rating: 4.5,
    reviews: 189,
  },
  {
    id: "15",
    name: "Seats and Upholstery",
    category: "Automotive",
    description:
      "Ergonomic vehicle seating systems with premium fabric or leather upholstery options. Engineered for comfort, safety, and style in modern vehicles.",
    image:
      "https://katzkin.com/wp-content/uploads/2019/09/Mazda-cx-5-leather-seats-1-768x768.jpg",
    price: "$100‑1200/set",
    rating: 4.6,
    reviews: 412,
  },
  {
    id: "16",
    name: "Steel",
    category: "Metals",
    description:
      "Structural steel beams, sheets, and bars for heavy-duty and construction-grade applications. Used in chassis, frameworks, and load-bearing assemblies.",
    image:
      "https://images.pexels.com/photos/46167/iron-rods-reinforcing-bars-rods-steel-bars-46167.jpeg",
    price: "$2‑25/kg",
    rating: 4.4,
    reviews: 156,
  },
  {
    id: "17",
    name: "Tyres",
    category: "Automotive",
    description:
      "Durable all‑weather tyres optimized for performance, safety, and road conditions. Available in multiple tread designs for commercial and personal vehicles.",
    image: "https://images.pexels.com/photos/3807167/pexels-photo-3807167.jpeg",
    price: "$50‑300/piece",
    rating: 4.7,
    reviews: 134,
  },
];