export class CreatePostDto {
  id?: number;
  content: string;
  title: string;
  user: string;
  categories: [string];
}

export class UpdatePostDto {
  id: number;
  content: string;
  title: string;
  user?: string;
  categories?: [string];
}
