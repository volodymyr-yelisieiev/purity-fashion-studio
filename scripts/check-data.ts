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
      portfolioUk.docs.map((d) => ({
        title: d.title,
        description: d.description,
        challenge: d.challenge,
        solution: d.solution,
        result: d.result,
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
      servicesUk.docs.map((d) => ({
        title: d.title,
        steps: d.steps,
        includes: d.includes,
      })),
      null,
      2,
    ),
  );

  console.log("--- LOOKBOOKS (UK) ---");
  const lookbooksUk = await payload.find({
    collection: "lookbooks",
    locale: "uk",
  });
  console.log(
    JSON.stringify(
      lookbooksUk.docs.map((d) => ({
        name: d.name,
        materials: d.materials,
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
      coursesUk.docs.map((d) => ({
        title: d.title,
        curriculum: d.curriculum,
        testimonials: d.testimonials,
        faq: d.faq,
      })),
      null,
      2,
    ),
  );

  console.log("--- COURSES (EN) ---");
  const coursesEn = await payload.find({ collection: "courses", locale: "en" });
  console.log(
    JSON.stringify(
      coursesEn.docs.map((d) => ({
        title: d.title,
        curriculum: d.curriculum,
        testimonials: d.testimonials,
        faq: d.faq,
      })),
      null,
      2,
    ),
  );

  process.exit(0);
};

check();
