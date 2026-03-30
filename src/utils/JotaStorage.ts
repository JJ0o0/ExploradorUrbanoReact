import { File, Paths } from "expo-file-system";

export type PhotoData = {
	id: number;
	imageUri: string;
	description: string;
	date: string;
	location: { latitude: number; longitude: number };
	cityName: string;
};

const DATAFILE_NAME = "jotaSalvamentos.json";

export const JotaStorage = {
	async savePhoto(
		tempUri: string,
		description: string,
		coords: { latitude: number; longitude: number },
		cityName: string,
	) {
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
				location: coords,
				cityName: cityName,
			};

			currentData.push(newItem);

			await dataFile.write(JSON.stringify(currentData));

			return true;
		} catch (error) {
			console.error("Erro no JotaStorage:", error);
			return false;
		}
	},
	async updatePhoto(id: number, newDescription: string) {
		try {
			const photos = await this.getAllPhotos();
			const updated = photos.map((p) =>
				p.id === id ? { ...p, description: newDescription } : p,
			);

			const dataFile = new File(Paths.document, DATAFILE_NAME);
			await dataFile.write(JSON.stringify(updated));
			return true;
		} catch (e) {
			console.error("Erro ao atualizar:", e);
			return false;
		}
	},
	async deletePhoto(id: number) {
		try {
			const photos = await this.getAllPhotos();
			const filtered = photos.filter((photo) => photo.id !== id);

			const dataFile = new File(Paths.document, DATAFILE_NAME);
			await dataFile.write(JSON.stringify(filtered));

			return true;
		} catch (error) {
			console.error("Erro ao deletar: ", error);

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
	async clearPhotos() {
		try {
			const dataFile = new File(Paths.document, DATAFILE_NAME);

			if (dataFile.exists) {
				await dataFile.delete();
			}

			return true;
		} catch (error) {
			console.error("Erro ao limpar dados:", error);

			return false;
		}
	},
};
