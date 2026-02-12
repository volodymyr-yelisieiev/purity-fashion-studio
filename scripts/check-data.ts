import { getPayload } from "payload";
import config from "../payload.config";

const check = async () => {
  const payload = await getPayload({ config });

  console.log("--- PORTFOLIO (UK) ---");
  const portfolioUk = await payload.find({
    collection: "portfolio",
    locale: "uk",
  });
  console.log(
    JSON.stringify(
      portfolioUk.docs.map((d: any) => ({
        title: d.title,
        excerpt: d.excerpt,
        challenge: d.challenge,
        transformation: d.transformation,
        solution: d.solution,
      })),
      null,
      2,
    ),
  );

  console.log("--- SERVICES (UK) ---");
  const servicesUk = await payload.find({
    collection: "services",
    locale: "uk",
  });
  console.log(
    JSON.stringify(
      servicesUk.docs.map((d: any) => ({
        title: d.title,
        process: d.process,
        deliverables: d.deliverables,
      })),
      null,
      2,
    ),
  );

  console.log("--- PRODUCTS (UK) ---");
  const productsUk = await payload.find({
    collection: "products",
    locale: "uk",
  });
  console.log(
    JSON.stringify(
      productsUk.docs.map((d: any) => ({
        name: d.name,
        material: d.details?.material,
        priceEur: d.pricing?.eur,
      })),
      null,
      2,
    ),
  );

  console.log("--- COURSES (UK) ---");
  const coursesUk = await payload.find({ collection: "courses", locale: "uk" });
  console.log(
    JSON.stringify(
      coursesUk.docs.map((d: any) => ({
        title: d.title,
        faq: d.faq,
      })),
      null,
      2,
    ),
  );

  console.log("--- PORTFOLIO (EN) ---");
  const portfolioEn = await payload.find({
    collection: "portfolio",
    locale: "en",
  });
  console.log(
    JSON.stringify(
      portfolioEn.docs.map((d: any) => ({
        title: d.title,
        excerpt: d.excerpt,
        challenge: d.challenge,
        transformation: d.transformation,
        solution: d.solution,
      })),
      null,
      2,
    ),
  );

  console.log("--- COURSES (EN) ---");
  const coursesEn = await payload.find({ collection: "courses", locale: "en" });
  console.log(
    JSON.stringify(
      coursesEn.docs.map((d: any) => ({
        title: d.title,
        faq: d.faq,
      })),
      null,
      2,
    ),
  );

  process.exit(0);
};

check();
