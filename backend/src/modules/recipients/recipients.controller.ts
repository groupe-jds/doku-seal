import {
  Controller,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RecipientsService } from './recipients.service';
import { AddRecipientDto, UpdateRecipientDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('recipients')
@Controller('recipients')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RecipientsController {
  constructor(private readonly recipientsService: RecipientsService) {}

  @Post()
  @ApiOperation({ summary: 'Add recipient to envelope' })
  @ApiResponse({
    status: 201,
    description: 'Recipient added successfully',
  })
  async add(
    @CurrentUser() user: any,
    @Body() dto: AddRecipientDto,
  ) {
    const teamId = 1; // Hardcoded for now
    return this.recipientsService.add(user.userId, teamId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update recipient' })
  @ApiResponse({
    status: 200,
    description: 'Recipient updated successfully',
  })
  async update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateRecipientDto,
  ) {
    const teamId = 1; // Hardcoded for now
    return this.recipientsService.update(id, user.userId, teamId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove recipient' })
  @ApiResponse({
    status: 200,
    description: 'Recipient removed successfully',
  })
  async remove(
    @CurrentUser() user: any,
    @Param('id') id: string,
  ) {
    const teamId = 1; // Hardcoded for now
    return this.recipientsService.remove(id, user.userId, teamId);
  }
}
