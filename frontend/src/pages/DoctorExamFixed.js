import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { 
    Box, 
    Button, 
    Typography, 
    Paper, 
    FormGroup, 
    FormControlLabel, 
    Checkbox, 
    Divider, 
    FormControl, 
    FormLabel, 
    RadioGroup, 
    Radio, 
    TextField, 
    Grid 
} from '@mui/material';
import axios from '../utils/axios';
import jsPDF from 'jspdf';

export default function DoctorExamFixed() {
    const { id: registrationId } = useParams();
    const location = useLocation();
    const prevExamsRef = useRef(null);

    const [previousExams, setPreviousExams] = useState([]);
    const [showPrevious, setShowPrevious] = useState(false);
    const [loadingPrev, setLoadingPrev] = useState(false);
    const [registrationDetails, setRegistrationDetails] = useState(null);
    const [visual, setVisual] = useState([]);
    const [via, setVia] = useState('Negative');
    const [extendsEndo, setExtendsEndo] = useState('No');
    const [quadrantCount, setQuadrantCount] = useState('TwoOrLess');
    const [quadrantSelected, setQuadrantSelected] = useState([]);
    const [biopsyTaken, setBiopsyTaken] = useState(false);
    const [biopsySiteNotes, setBiopsySiteNotes] = useState('');
    const [actions, setActions] = useState([]);
    const [otherActionText, setOtherActionText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (registrationId) {
            fetchRegistrationDetails();
            if (location?.state?.showPrevious) {
                fetchPreviousExams();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [registrationId]);

    const fetchRegistrationDetails = async () => {
        try {
            const res = await axios.get(`/api/registrations/${registrationId}`);
            setRegistrationDetails(res.data);
        } catch (err) {
            console.error('Failed to load registration details', err);
            alert('Failed to load registration details');
        }
    };

    const fetchPreviousExams = async () => {
        if (!registrationId) return;
        setLoadingPrev(true);
        try {
            const res = await axios.get(`/api/doctor-exams/registration/${registrationId}`);
            setPreviousExams(res.data || []);
            setShowPrevious(true);
        } catch (err) {
            console.error('Failed to load previous exams', err);
            setPreviousExams([]);
            alert('Failed to load previous exams');
        } finally {
            setLoadingPrev(false);
        }
    };

    const generatePdf = () => {
        if (!previousExams || previousExams.length === 0) {
            throw new Error('No examinations to export');
        }

        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 25.4;
        const marginLeft = margin;
        const marginRight = margin;
        const marginTop = margin;
        const marginBottom = margin;
        const contentWidth = pageWidth - marginLeft - marginRight;
        let y = marginTop;
        const lineHeight = 7;
        let pageNumber = 1;

        const addPageNumber = () => {
            pdf.setFontSize(9);
            pdf.setTextColor(128);
            pdf.text(`Page ${pageNumber}`, pageWidth - marginRight, pageHeight - (marginBottom / 2), { align: 'right' });
        };

        const addPageHeader = () => {
            y = marginTop;

            pdf.setFontSize(20);
            pdf.setFont(undefined, 'bold');
            pdf.setTextColor(0);
            pdf.text('Medical Examination Report', pageWidth/2, y, { align: 'center' });
            y += lineHeight * 2;

            pdf.setDrawColor(0);
            pdf.setLineWidth(0.1);
            const boxStartY = y;
            const boxHeight = lineHeight * 6;

            pdf.rect(marginLeft, boxStartY, contentWidth, boxHeight);

            pdf.setFontSize(11);
            pdf.text('Patient Details:', marginLeft + 5, boxStartY + lineHeight);

            pdf.setFontSize(10);
            pdf.setFont(undefined, 'normal');

            const col1 = marginLeft + 10;
            const col2 = marginLeft + (contentWidth / 2);
            y = boxStartY + lineHeight * 2.5;

            const addField = (x, label, value) => {
                pdf.text(`${label}: ${value || 'N/A'}`, x, y);
            };

            addField(col1, 'Name', registrationDetails?.name);
            addField(col2, 'Camp', registrationDetails?.camp_name);
            y += lineHeight;

            addField(col1, 'Age', registrationDetails?.age);
            addField(col2, 'Gender', registrationDetails?.gender);
            y += lineHeight;

            addField(col1, 'Mobile', registrationDetails?.mobile);
            addField(col2, 'OPD', registrationDetails?.uid || registrationId);

            y = boxStartY + boxHeight + lineHeight;
            return y;
        };

        // Add header to first page
        y = addPageHeader();
        addPageNumber();

        // Add exams
        previousExams.forEach((exam, idx) => {
            if (y > pageHeight - marginBottom - lineHeight * 10) {
                pdf.addPage();
                pageNumber++;
                y = addPageHeader();
                addPageNumber();
            }

            pdf.setFillColor(245, 245, 245);
            pdf.rect(marginLeft, y - lineHeight/2, contentWidth, lineHeight * 2, 'F');
            
            pdf.setFont(undefined, 'bold');
            pdf.text(`Examination ${idx + 1}`, marginLeft + 5, y);
            const examDate = exam.created_at ? new Date(exam.created_at).toLocaleString() : '-';
            pdf.text(examDate, marginLeft + contentWidth - 5, y, { align: 'right' });
            y += lineHeight * 2;

            pdf.setFont(undefined, 'normal');
            
            // VIA Result with color coding
            const viaText = `VIA Result: ${exam.via_result || 'N/A'}`;
            if (exam.via_result === 'Positive') {
                pdf.setTextColor(255, 0, 0);
            } else if (exam.via_result === 'Negative') {
                pdf.setTextColor(0, 128, 0);
            }
            pdf.text(viaText, marginLeft + 5, y);
            pdf.setTextColor(0);
            y += lineHeight;

            // Visual Findings
            const visualFindings = Array.isArray(exam.visual_findings) 
                ? exam.visual_findings.join(', ') 
                : exam.visual_findings || 'N/A';
            pdf.text(`Visual Findings: ${visualFindings}`, marginLeft + 5, y);
            y += lineHeight * 2;

            // Additional details for VIA positive cases
            if (exam.via_result === 'Positive') {
                pdf.setFillColor(248, 248, 248);
                pdf.rect(marginLeft, y, contentWidth, lineHeight * 8, 'F');
                
                pdf.setFont(undefined, 'bold');
                pdf.text('Findings after application of 5% acetic (V.I.A):', marginLeft + 5, y);
                y += lineHeight * 1.5;

                pdf.text('Does the acetowhite lesion extend into the endocervical canal?', marginLeft + 10, y);
                y += lineHeight;
                pdf.setFont(undefined, 'normal');
                pdf.text(`Answer: ${exam.via_extends_endocervical || 'No'}`, marginLeft + 15, y);
                y += lineHeight * 1.5;

                pdf.setFont(undefined, 'bold');
                pdf.text('How many quadrants are involved?', marginLeft + 10, y);
                y += lineHeight;
                pdf.setFont(undefined, 'normal');
                const quadrantCountText = exam.via_quadrant_count === 'TwoOrLess' ? 'Two or Less' 
                    : exam.via_quadrant_count === 'Three' ? 'Three'
                    : exam.via_quadrant_count === 'Four' ? 'Four' : '-';
                pdf.text(`Answer: ${quadrantCountText}`, marginLeft + 15, y);
                y += lineHeight * 1.5;

                if (exam.via_quadrants && exam.via_quadrants.length > 0) {
                    pdf.setFont(undefined, 'bold');
                    pdf.text('Which quadrants are involved?', marginLeft + 10, y);
                    y += lineHeight;
                    pdf.setFont(undefined, 'normal');

                    const quadrantsList = Array.isArray(exam.via_quadrants) 
                        ? exam.via_quadrants 
                        : [exam.via_quadrants];
                    const allQuadrants = ['IA', 'IB', 'IIA', 'IIB', 'IIIA', 'IIIB', 'IVA', 'IVB'];
                    
                    allQuadrants.forEach((q, i) => {
                        const isChecked = quadrantsList.includes(q);
                        pdf.text(`[${isChecked ? 'x' : ' '}] ${q}`, 
                            marginLeft + 15 + (i % 4) * 30, 
                            y + Math.floor(i / 4) * lineHeight
                        );
                    });
                    y += lineHeight * 3;
                }
            }

            // Biopsy information
            if (exam.biopsy_taken) {
                pdf.setFont(undefined, 'bold');
                pdf.text('Biopsy:', marginLeft + 5, y);
                pdf.setFont(undefined, 'normal');
                pdf.text('Yes', marginLeft + 10, y);
                y += lineHeight;
                
                if (exam.biopsy_site_notes) {
                    pdf.setFont(undefined, 'italic');
                    const biopsyLines = pdf.splitTextToSize(exam.biopsy_site_notes, contentWidth - 15);
                    biopsyLines.forEach(line => {
                        pdf.text(line, marginLeft + 10, y);
                        y += lineHeight;
                    });
                }
                y += lineHeight;
            }

            // Actions taken
            pdf.setFont(undefined, 'bold');
            pdf.text('Actions Taken:', marginLeft + 5, y);
            y += lineHeight;
            pdf.setFont(undefined, 'normal');
            if (exam.actions_taken && exam.actions_taken.length > 0) {
                const actionText = Array.isArray(exam.actions_taken) 
                    ? exam.actions_taken.join(', ') 
                    : exam.actions_taken;
                const actionLines = pdf.splitTextToSize(actionText, contentWidth - 15);
                actionLines.forEach(line => {
                    pdf.text(line, marginLeft + 10, y);
                    y += lineHeight;
                });
            } else {
                pdf.text('None', marginLeft + 10, y);
                y += lineHeight;
            }

            // Add separator
            y += lineHeight;
            pdf.setDrawColor(200);
            pdf.line(marginLeft, y, marginLeft + contentWidth, y);
            y += lineHeight * 1.5;
        });

        return pdf;
    };

    const handlePdfDownload = () => {
        try {
            const doc = generatePdf();
            doc.save(`registration_${registrationId}_examinations.pdf`);
        } catch (err) {
            console.error('Failed to generate PDF:', err);
            alert('Failed to generate PDF');
        }
    };

    const safeParseVisual = (raw) => {
        if (!raw) return '-';
        if (Array.isArray(raw)) return raw.join(', ');
        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) return parsed.join(', ');
            return String(parsed);
        } catch (e) {
            return String(raw);
        }
    };

    const toggleVisual = (id) => setVisual((s) => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
    const toggleQuadrant = (q) => setQuadrantSelected((s) => s.includes(q) ? s.filter(x => x !== q) : [...s, q]);
    const toggleAction = (id) => setActions((s) => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

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

            if (registrationId) {
                payload.registration_id = registrationId;
            }

            await axios.post('/api/doctor-exams', payload);
            alert('Doctor exam saved');
            
            // Reset all form fields
            setVisual([]);
            setVia('Negative');
            setExtendsEndo('No');
            setQuadrantCount('TwoOrLess');
            setQuadrantSelected([]);
            setBiopsyTaken(false);
            setBiopsySiteNotes('');
            setActions([]);
            setOtherActionText('');
            
            // Refresh the previous exams list
            fetchPreviousExams();
        } catch (err) {
            console.error('Failed to save exam:', err);
            alert('Failed to save exam');
        } finally {
            setSubmitting(false);
        }
    };

    // ...existing code...
    // Doctor Examination Form UI (copied from DoctorExam.js)
    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
            <Box sx={{ mb: 4 }}>
                {showPrevious && (
                    <Box sx={{ mb: 3 }} ref={prevExamsRef}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6" sx={{ color: 'primary.main' }}>Previous Doctor Examinations</Typography>
                            <Box>
                                <Button variant="outlined" size="small" sx={{ mr: 1 }} onClick={fetchPreviousExams}>Refresh</Button>
                                <Button variant="contained" size="small" color="primary" onClick={handlePdfDownload} disabled={!previousExams || previousExams.length === 0}>Download PDF</Button>
                            </Box>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            {loadingPrev && <Typography>Loading...</Typography>}
                            {!loadingPrev && previousExams.length === 0 && (
                                <Typography color="text.secondary">No previous exams found.</Typography>
                            )}
                            {!loadingPrev && previousExams.length > 0 && (
                                <Box>
                                    {previousExams.map(exam => (
                                        <Paper key={exam.doctor_exam_id} sx={{ p: 2, mb: 2 }}>
                                            <Typography variant="subtitle2" color="primary">
                                                Date: {exam.created_at ? new Date(exam.created_at).toLocaleString() : '-'}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>VIA Result:</strong> {exam.via_result || 'N/A'}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Visual Findings:</strong> {safeParseVisual(exam.visual_findings)}
                                            </Typography>
                                        </Paper>
                                    ))}
                                </Box>
                            )}
                        </Box>
                    </Box>
                )}
            </Box>
            <Paper component="form" onSubmit={handleSubmit} elevation={2} sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ mb: 3, color: 'primary.main', fontWeight: 'medium' }}>
                    Doctor Examination
                </Typography>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.secondary' }}>
                        Visual Examination Findings
                    </Typography>
                    <FormGroup row sx={{ gap: 2 }}>
                        {/* You may need to define visualOptions and quadrants at the top of the file if not present */}
                        {['Nabothian', 'Leukoplakia', 'Polyp', 'AnyGrowth'].map(opt => (
                            <FormControlLabel
                                key={opt}
                                control={<Checkbox checked={visual.includes(opt)} onChange={() => toggleVisual(opt)} color="primary" />}
                                label={opt}
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
                        <RadioGroup row value={via} onChange={(e) => setVia(e.target.value)} sx={{ gap: 2 }}>
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
                            <RadioGroup row value={extendsEndo} onChange={(e) => setExtendsEndo(e.target.value)} sx={{ mt: 1 }}>
                                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                                <FormControlLabel value="No" control={<Radio />} label="No" />
                            </RadioGroup>
                        </FormControl>
                        <FormControl component="fieldset" sx={{ mb: 3 }}>
                            <FormLabel component="legend">
                                How many quadrants are involved?
                            </FormLabel>
                            <RadioGroup row value={quadrantCount} onChange={(e) => setQuadrantCount(e.target.value)} sx={{ mt: 1 }}>
                                <FormControlLabel value="TwoOrLess" control={<Radio />} label="Two or Less" />
                                <FormControlLabel value="Three" control={<Radio />} label="Three" />
                                <FormControlLabel value="Four" control={<Radio />} label="Four" />
                            </RadioGroup>
                        </FormControl>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Which quadrants are involved?</FormLabel>
                            <FormGroup row sx={{ mt: 1, gap: 2 }}>
                                {['IA', 'IB', 'IIA', 'IIB', 'IIIA', 'IIIB', 'IVA', 'IVB'].map(q => (
                                    <FormControlLabel
                                        key={q}
                                        control={<Checkbox checked={quadrantSelected.includes(q)} onChange={() => toggleQuadrant(q)} color="primary" />}
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
                        control={<Checkbox checked={biopsyTaken} onChange={(e) => setBiopsyTaken(e.target.checked)} color="primary" />}
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
                            control={<Checkbox checked={actions.includes('Follow5Years')} onChange={() => toggleAction('Follow5Years')} color="primary" />}
                            label="Advised follow up after Five Years"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={actions.includes('MedCervicitis')} onChange={() => toggleAction('MedCervicitis')} color="primary" />}
                            label="Advised medication for cervicitis and follow up after six months"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={actions.includes('ImmediateTreatment')} onChange={() => toggleAction('ImmediateTreatment')} color="primary" />}
                            label="Referred for immediate treatment"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={actions.includes('StagingTreatment')} onChange={() => toggleAction('StagingTreatment')} color="primary" />}
                            label="Referred for staging and treatment of invasive cancer"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={actions.includes('Others')} onChange={() => toggleAction('Others')} color="primary" />}
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
                            <Button type="submit" variant="contained" disabled={submitting} sx={{ px: 4 }}>
                                Save Examination
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button type="button" variant="outlined" onClick={() => window.history.back()} sx={{ px: 4 }}>
                                Cancel
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Box>
    );
}
