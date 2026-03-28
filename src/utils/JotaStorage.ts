import { File, Paths } from "expo-file-system";

export type PhotoData = {
	id: number;
	imageUri: string;
	description: string;
	date: string;
};

const DATAFILE_NAME = "jotaSalvamentos.json";

export const JotaStorage = {
	async savePhoto(tempUri: string, description: string) {
		try {
			const tempFile = new File(tempUri);

			const fileName = `foto_${Date.now()}.jpg`;
			const permanentFile = new File(Paths.document, fileName);

			await tempFile.move(permanentFile);

			const dataFile = new File(Paths.document, DATAFILE_NAME);
			let currentData: PhotoData[] = [];

			if (dataFile.exists) {
				const content = await dataFile.text();
				currentData = JSON.parse(content);
			} else {
				await dataFile.create();
			}

			const newItem: PhotoData = {
				id: Date.now(),
				imageUri: permanentFile.uri,
				description: description,
				date: new Date().toISOString(),
			};

			currentData.push(newItem);

			await dataFile.write(JSON.stringify(currentData));

			return true;
		} catch (error) {
			console.error("Erro no JotaStorage:", error);
			return false;
		}
	},

	async getAllPhotos(): Promise<PhotoData[]> {
		try {
			const dataFile = new File(Paths.document, DATAFILE_NAME);
			if (!dataFile.exists) return [];

			const content = await dataFile.text();
			return JSON.parse(content);
		} catch (error) {
			console.error("Erro ao ler fotos:", error);
			return [];
		}
	},
};
