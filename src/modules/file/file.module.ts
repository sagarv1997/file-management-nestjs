import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BucketConfigRepository } from '../auth/repositories/bucket-config.repository';
import { ProjectRepository } from '../auth/repositories/project.repository';
import { FileController } from './controllers/file.controller';
import { BulkFileAccessedListener } from './listeners/bulk-file-accessed.listener';
import { FileAccessedListener } from './listeners/file-accessed.listener';
import { FileArchiveListener } from './listeners/file-archive.listener';
import { AccessLogRepository } from './repositories/access-log.repository';
import { FileRepository } from './repositories/file.repository';
import { MimeTypeRepository } from './repositories/mime-type.repository';
import { TemplateRepository } from './repositories/template.repository';
import { FileService } from './services/file.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FileRepository,
      TemplateRepository,
      MimeTypeRepository,
      AccessLogRepository,
      ProjectRepository,
      BucketConfigRepository,
    ]),
  ],
  controllers: [FileController],
  providers: [
    FileService,
    FileAccessedListener,
    FileArchiveListener,
    BulkFileAccessedListener,
  ],
})
export class FileModule {}
