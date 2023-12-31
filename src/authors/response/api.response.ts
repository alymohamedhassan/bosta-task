import { ApiProperty, getSchemaPath } from "@nestjs/swagger"
import { AuthorDto } from "../dto/create-author.dto"

export class ResponseSingleAuthorDto {
  @ApiProperty()
  author: AuthorDto;
}

export class ResponseAuthorsDto {
  @ApiProperty({type: 'array', items: {$ref: getSchemaPath(AuthorDto)}})
  authors: AuthorDto[];
}
