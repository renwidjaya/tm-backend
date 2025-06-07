import { CorsOptions } from "cors";

const corsOptions: CorsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "X-Forwarded-For",
    "id_user",
    "kode_group",
    "token_lama",
    "token_baru",
  ],
};

export default corsOptions;
