import { Controller, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import type { FieldsService } from './fields.service';
import type { AddFieldDto, UpdateFieldDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserPayload } from '../auth/strategies/jwt.strategy';

@ApiTags('fields')
@Controller('fields')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FieldsController {
  constructor(private readonly fieldsService: FieldsService) {}

  @Post()
  @ApiOperation({ summary: 'Add field to envelope' })
  @ApiResponse({
    status: 201,
    description: 'Field added successfully',
  })
  async add(@CurrentUser() user: CurrentUserPayload, @Body() dto: AddFieldDto) {
    const teamId = 1; // Hardcoded for now
    return this.fieldsService.add(user.userId, teamId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update field' })
  @ApiResponse({
    status: 200,
    description: 'Field updated successfully',
  })
  async update(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() dto: UpdateFieldDto,
  ) {
    const teamId = 1; // Hardcoded for now
    return this.fieldsService.update(id, user.userId, teamId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove field' })
  @ApiResponse({
    status: 200,
    description: 'Field removed successfully',
  })
  async remove(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    const teamId = 1; // Hardcoded for now
    return this.fieldsService.remove(id, user.userId, teamId);
  }
}
