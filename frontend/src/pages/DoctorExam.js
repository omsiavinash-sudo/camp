import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { 
	Box, 
	Button, 
	Checkbox, 
	FormControl, 
	FormControlLabel, 
	FormGroup, 
	Grid, 
	TextField, 
	Typography, 
	RadioGroup, 
	Radio, 
	FormLabel,
	Paper,
	Divider
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from '../utils/axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
			<Box sx={{ mb: 4 }}>
				{showPrevious && (
					<Box sx={{ mb: 3 }} ref={prevExamsRef}>
						<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
							<Typography variant="h6" sx={{ color: 'primary.main' }}>Previous Doctor Examinations</Typography>
			while (heightLeft > -0.1) {
				position = position - pdfHeight;
				pdf.addPage();
				pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
				heightLeft -= pdfHeight;
			}
			pdf.save(`registration_${registrationId}_examinations.pdf`);
		} catch (err) {
			console.error('Failed to generate PDF:', err);
			alert('Failed to generate PDF');
		}
	};
	const [via, setVia] = useState('Negative');
	const [extendsEndo, setExtendsEndo] = useState('No');
	const [quadrantCount, setQuadrantCount] = useState('TwoOrLess');
	const [quadrantSelected, setQuadrantSelected] = useState([]);
	const [biopsyTaken, setBiopsyTaken] = useState(false);
	const [biopsySiteNotes, setBiopsySiteNotes] = useState('');
	const [actions, setActions] = useState([]);
	const [otherActionText, setOtherActionText] = useState('');
	const [submitting, setSubmitting] = useState(false);

	const toggleVisual = (id) => {
		setVisual((s) => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
	};

	const toggleQuadrant = (q) => {
		setQuadrantSelected((s) => s.includes(q) ? s.filter(x => x !== q) : [...s, q]);
	};

	const toggleAction = (id) => {
		setActions((s) => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);
		try {
			const payload = {
				visual_findings: visual,
				via_result: via,
				via_extends_endocervical: via === 'Positive' ? extendsEndo : null,
				via_quadrant_count: via === 'Positive' ? quadrantCount : null,
				via_quadrants: via === 'Positive' ? quadrantSelected : [],
				biopsy_taken: !!biopsyTaken,
				biopsy_site_notes: biopsyTaken ? biopsySiteNotes : null,
				actions_taken: actions,
				actions_other_text: actions.includes('Others') ? otherActionText : null
			};

			// include registration id if present in route
			if (registrationId) payload.registration_id = registrationId;

			await axios.post('/api/doctor-exams', payload);
			alert('Doctor exam saved');
			// reset minimal
			setVisual([]);
			setVia('Negative');
			setExtendsEndo('No');
			setQuadrantCount('TwoOrLess');
			setQuadrantSelected([]);
			setBiopsyTaken(false);
			setBiopsySiteNotes('');
			setActions([]);
			setOtherActionText('');
		} catch (err) {
			console.error(err);
			alert('Failed to save exam');
		} finally {
			setSubmitting(false);
		}
	};
				
		return (
			<Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
				<Box sx={{ mb: 4 }}>
					{showPrevious && (
						<Box sx={{ mb: 3 }} ref={prevExamsRef}>
							<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
								<Typography variant="h6" sx={{ color: 'primary.main' }}>Previous Doctor Examinations</Typography>
								<Box>
									<Button variant="outlined" size="small" sx={{ mr: 1 }} onClick={() => fetchPreviousExams()}>Refresh</Button>
									<Button variant="contained" size="small" color="primary" onClick={downloadPreviousExamsPdf}>Download PDF</Button>
								</Box>
							</Box>

							<Box sx={{ mb: 2 }}>
							<Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>Previous Doctor Examinations</Typography>
							{loadingPrev && <Typography>Loading...</Typography>}
							{!loadingPrev && previousExams.length === 0 && (
								<Typography color="text.secondary">No previous exams found.</Typography>
							)}
							{!loadingPrev && previousExams.length > 0 && (
								<Box>
									{previousExams.map(exam => (
										<Box 
											key={exam.doctor_exam_id} 
											sx={{ 
												p: 2, 
												mb: 2, 
												border: '1px solid #e0e0e0', 
												borderRadius: 2,
												bgcolor: 'background.paper',
												'&:hover': { boxShadow: 1 }
											}
											}>
											<Grid container spacing={2}>
												<Grid item xs={12} sm={6}>
													<Typography variant="subtitle2" color="primary">
														Date: {exam.created_at ? new Date(exam.created_at).toLocaleString() : '-'}
													</Typography>
												</Grid>
												<Grid item xs={12} sm={6}>
													<Typography variant="subtitle2" color="primary">
														Doctor: {exam.recorded_by || '-'}
													</Typography>
												</Grid>
												<Grid item xs={12}>
													<Typography variant="body2">
														<strong>VIA Result:</strong> {exam.via_result}
													</Typography>
												</Grid>
												<Grid item xs={12}>
													<Typography variant="body2">
														<strong>Visual Findings:</strong> {Array.isArray(exam.visual_findings) ? 
														exam.visual_findings.join(', ') : 
														(exam.visual_findings ? JSON.parse(exam.visual_findings).join(', ') : '-')}
													</Typography>
												</Grid>
											</Grid>
										</Box>
									))}
								</Box>
							)}
						</Box>
					)}

				</Box>

				<Paper 
					component="form" 
					onSubmit={handleSubmit} 
					elevation={2} 
					sx={{ p: 3 }}
				>
					<Typography variant="h5" sx={{ mb: 3, color: 'primary.main', fontWeight: 'medium' }}>
						Doctor Examination
					</Typography>

					<Box sx={{ mb: 4 }}>
						<Typography variant="subtitle1" sx={{ mb: 2, color: 'text.secondary' }}>
							Visual Examination Findings
						</Typography>
						<FormGroup row sx={{ gap: 2 }}>
							{visualOptions.map(opt => (
								<FormControlLabel
									key={opt.id}
									control={
										<Checkbox 
											checked={visual.includes(opt.id)} 
											onChange={() => toggleVisual(opt.id)}
											color="primary" 
										/>
									}
									label={opt.label}
								/>
							))}
						</FormGroup>
					</Box>

					<Divider sx={{ my: 3 }} />

					<Box sx={{ mb: 4 }}>
						<FormControl component="fieldset">
							<FormLabel component="legend" sx={{ mb: 2 }}>
								Findings one minute after application of 5% acetic (V.I.A)
							</FormLabel>
							<RadioGroup 
								row 
								value={via} 
								onChange={(e) => setVia(e.target.value)}
								sx={{ gap: 2 }}
							>
								<FormControlLabel value="Negative" control={<Radio />} label="Negative" />
								<FormControlLabel value="Positive" control={<Radio />} label="Positive" />
								<FormControlLabel value="Invasive/Cancer" control={<Radio />} label="Invasive/Cancer" />
							</RadioGroup>
						</FormControl>
					</Box>

					{via === 'Positive' && (
						<Box sx={{ mb: 4, p: 3, bgcolor: 'action.hover', borderRadius: 1 }}>
							<FormControl component="fieldset" sx={{ mb: 3 }}>
								<FormLabel component="legend">
									Does the acetowhite lesion extend into the endocervical canal?
								</FormLabel>
								<RadioGroup 
									row 
									value={extendsEndo} 
									onChange={(e) => setExtendsEndo(e.target.value)}
									sx={{ mt: 1 }}
								>
									<FormControlLabel value="Yes" control={<Radio />} label="Yes" />
									<FormControlLabel value="No" control={<Radio />} label="No" />
								</RadioGroup>
							</FormControl>

							<FormControl component="fieldset" sx={{ mb: 3 }}>
								<FormLabel component="legend">
									How many quadrants are involved?
								</FormLabel>
								<RadioGroup 
									row 
									value={quadrantCount} 
									onChange={(e) => setQuadrantCount(e.target.value)}
									sx={{ mt: 1 }}
								>
									<FormControlLabel value="TwoOrLess" control={<Radio />} label="Two or Less" />
									<FormControlLabel value="Three" control={<Radio />} label="Three" />
									<FormControlLabel value="Four" control={<Radio />} label="Four" />
								</RadioGroup>
							</FormControl>

							<FormControl component="fieldset">
								<FormLabel component="legend">Which quadrants are involved?</FormLabel>
								<FormGroup row sx={{ mt: 1, gap: 2 }}>
									{quadrants.map(q => (
										<FormControlLabel
											key={q}
											control={
												<Checkbox 
													checked={quadrantSelected.includes(q)} 
													onChange={() => toggleQuadrant(q)}
													color="primary"
												/>
											}
											label={q}
										/>
									))}
								</FormGroup>
							</FormControl>
						</Box>
					)}

					<Divider sx={{ my: 3 }} />

					<Box sx={{ mb: 4 }}>
						<FormControlLabel
							control={
								<Checkbox 
									checked={biopsyTaken} 
									onChange={(e) => setBiopsyTaken(e.target.checked)}
									color="primary"
								/>
							}
							label="Biopsy taken? (If yes, mark site in diagram with k)"
						/>
						{biopsyTaken && (
							<TextField
								fullWidth
								multiline
								minRows={2}
								value={biopsySiteNotes}
								onChange={(e) => setBiopsySiteNotes(e.target.value)}
								placeholder="Describe biopsy site (e.g. 3 o'clock on cervix)"
								sx={{ mt: 2 }}
							/>
						)}
					</Box>

					<Divider sx={{ my: 3 }} />

					<Box sx={{ mb: 4 }}>
						<FormLabel component="legend" sx={{ mb: 2 }}>Action taken</FormLabel>
						<FormGroup sx={{ gap: 1 }}>
							<FormControlLabel
								control={
									<Checkbox 
										checked={actions.includes('Follow5Years')} 
										onChange={() => toggleAction('Follow5Years')}
										color="primary"
									/>
								}
								label="Advised follow up after Five Years"
							/>
							<FormControlLabel
								control={
									<Checkbox 
										checked={actions.includes('MedCervicitis')} 
										onChange={() => toggleAction('MedCervicitis')}
										color="primary"
									/>
								}
								label="Advised medication for cervicitis and follow up after six months"
							/>
							<FormControlLabel
								control={
									<Checkbox 
										checked={actions.includes('ImmediateTreatment')} 
										onChange={() => toggleAction('ImmediateTreatment')}
										color="primary"
									/>
								}
								label="Referred for immediate treatment"
							/>
							<FormControlLabel
								control={
									<Checkbox 
										checked={actions.includes('StagingTreatment')} 
										onChange={() => toggleAction('StagingTreatment')}
										color="primary"
									/>
								}
								label="Referred for staging and treatment of invasive cancer"
							/>
							<FormControlLabel
								control={
									<Checkbox 
										checked={actions.includes('Others')} 
										onChange={() => toggleAction('Others')}
										color="primary"
									/>
								}
								label="Others (Specify)"
							/>
						</FormGroup>
						{actions.includes('Others') && (
							<TextField
								fullWidth
								value={otherActionText}
								onChange={(e) => setOtherActionText(e.target.value)}
								placeholder="Specify other action taken"
								sx={{ mt: 2 }}
							/>
						)}
					</Box>

					<Box sx={{ mt: 4 }}>
						<Grid container spacing={2}>
							<Grid item>
								<Button
									type="submit"
									variant="contained"
									disabled={submitting}
									sx={{ px: 4 }}
								>
									Save Examination
								</Button>
							</Grid>
							<Grid item>
								<Button
									type="button"
									variant="outlined"
									onClick={() => window.history.back()}
									sx={{ px: 4 }}
								>
									Cancel
								</Button>
							</Grid>
						</Grid>
					</Box>
				</Paper>
			</Box>
		);
}