import {defineConfig} from "vite";
import toml from '@iarna/toml';
import fs from 'fs/promises';

export default defineConfig(async () => {
        const config = await fs.readFile('./playpass.toml', 'utf8');
        const playpass = toml.parse(config);

        return {
            define: {
                playpass_game_id: JSON.stringify(playpass.game_id),
                playpass_game_name: JSON.stringify(playpass.game_name)
            },
            build: {
                rollupOptions: {
                    output: {
                        assetFileNames: `assets/[name].[hash][extname]`,
                        entryFileNames: `assets/[name].js`
                    },
                }
            }
        }
    }
);