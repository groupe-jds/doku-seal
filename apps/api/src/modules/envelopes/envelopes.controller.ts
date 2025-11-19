import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { EnvelopesService } from './envelopes.service';
import { CreateEnvelopeDto, UpdateEnvelopeDto, ListEnvelopesDto, SendEnvelopeDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('envelopes')
@Controller('envelopes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EnvelopesController {
  constructor(private readonly envelopesService: EnvelopesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new envelope' })
  @ApiResponse({
    status: 201,
    description: 'Envelope created successfully',
  })
  async create(
    @CurrentUser() user: any,
    @Body() createEnvelopeDto: CreateEnvelopeDto,
  ) {
    // TODO: Get teamId from user context or request
    const teamId = 1; // Hardcoded for now
    return this.envelopesService.create(user.userId, teamId, createEnvelopeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all envelopes' })
  @ApiResponse({
    status: 200,
    description: 'Envelopes retrieved successfully',
  })
  async findAll(
    @CurrentUser() user: any,
    @Query() query: ListEnvelopesDto,
  ) {
    const teamId = 1; // Hardcoded for now
    return this.envelopesService.findAll(user.userId, teamId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get envelope by ID' })
  @ApiResponse({
    status: 200,
    description: 'Envelope retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Envelope not found',
  })
  async findOne(
    @CurrentUser() user: any,
    @Param('id') id: string,
  ) {
    const teamId = 1; // Hardcoded for now
    return this.envelopesService.findOne(id, user.userId, teamId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an envelope' })
  @ApiResponse({
    status: 200,
    description: 'Envelope updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Envelope not found',
  })
  async update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() updateEnvelopeDto: UpdateEnvelopeDto,
  ) {
    const teamId = 1; // Hardcoded for now
    return this.envelopesService.update(id, user.userId, teamId, updateEnvelopeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an envelope' })
  @ApiResponse({
    status: 200,
    description: 'Envelope deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Envelope not found',
  })
  async remove(
    @CurrentUser() user: any,
    @Param('id') id: string,
  ) {
    const teamId = 1; // Hardcoded for now
    return this.envelopesService.remove(id, user.userId, teamId);
  }

  @Post(':id/send')
  @ApiOperation({ summary: 'Send an envelope' })
  @ApiResponse({
    status: 200,
    description: 'Envelope sent successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Envelope not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Envelope cannot be sent',
  })
  async send(
    @CurrentUser() user: any,
    @Param('id') id: string,
  ) {
    const teamId = 1; // Hardcoded for now
    return this.envelopesService.send(id, user.userId, teamId);
  }
}
