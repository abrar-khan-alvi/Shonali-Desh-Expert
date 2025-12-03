import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, User, Send, FileText } from 'lucide-react';
import { Card, Button, Badge } from '../components/UI';
import { useExpert } from '../context/ExpertContext';
import { submitConsultationReport } from '../services/firebase.service';

const RequestDetailsPage: React.FC = () => {
    const { requestId } = useParams<{ requestId: string }>();
    const navigate = useNavigate();
    const { expert, login } = useExpert(); // Re-login/refresh might be needed to get latest data if not real-time sync
    const [request, setRequest] = useState<any | null>(null);
    const [advice, setAdvice] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (expert && expert.consultRequests && requestId) {
            const req = expert.consultRequests[requestId];
            if (req) {
                setRequest({ id: requestId, ...req });
                // Pre-fill advice if already completed
                if (req.advice) {
                    setAdvice(req.advice);
                }
            }
        }
    }, [expert, requestId]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleSubmit = async () => {
        if (!advice.trim()) {
            alert("Please enter your advice before submitting.");
            return;
        }

        if (!expert || !request) return;

        setIsSubmitting(true);
        try {
            const timestamp = new Date().toISOString();
            await submitConsultationReport(expert.id, request.id, request.farmerId, {
                advice: advice,
                timestamp: timestamp
            });

            alert("Report submitted successfully!");
            navigate('/'); // Go back to dashboard
            // In a real app, we might want to trigger a context refresh here
            // For now, the next load will fetch fresh data or we rely on optimistic updates if implemented
        } catch (error) {
            console.error("Failed to submit report", error);
            alert("Failed to submit report. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!expert) return <div className="p-10 text-center">Loading...</div>;
    if (!request) return <div className="p-10 text-center">Request not found.</div>;

    // Parse problem details
    let problemDetails: any = { problems: [], carbonSavings: "" };
    let rawProblem = "No details available";

    try {
        if (request.shortProblem && typeof request.shortProblem === 'string' && request.shortProblem.trim().startsWith('{')) {
            const parsed = JSON.parse(request.shortProblem);
            if (parsed.aiConsultations) {
                const firstKey = Object.keys(parsed.aiConsultations)[0];
                if (firstKey) {
                    problemDetails = parsed.aiConsultations[firstKey];
                }
            }
        } else {
            rawProblem = request.shortProblem || rawProblem;
        }
    } catch (e) {
        console.error("Error parsing problem", e);
    }

    const isCompleted = request.status === 'completed';

    return (
        <div className="max-w-4xl mx-auto animate-fade-in pb-10">
            <Button variant="secondary" onClick={handleBack} className="mb-6 flex items-center text-text-light hover:text-text-dark">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Request Info */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="p-8 shadow-md">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-text-dark mb-2">Consultation Request</h1>
                                <div className="flex items-center text-text-light text-sm">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    {request.createdAt ? new Date(request.createdAt).toLocaleString() : 'Date N/A'}
                                </div>
                            </div>
                            <Badge color={isCompleted ? 'green' : 'yellow'}>{request.status || 'Pending'}</Badge>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-text-dark mb-3 flex items-center">
                                    <User className="w-5 h-5 mr-2 text-primary-green" />
                                    Farmer Details
                                </h3>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <p className="text-text-dark font-medium">ID: {request.farmerId}</p>
                                    <p className="text-text-light text-sm">Field ID: {request.fieldId}</p>
                                    <div className="flex items-center mt-2 text-text-light text-sm">
                                        <MapPin className="w-4 h-4 mr-1" />
                                        {request.location || 'Location not specified'}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-text-dark mb-3 flex items-center">
                                    <FileText className="w-5 h-5 mr-2 text-primary-green" />
                                    Problem Description
                                </h3>
                                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                                    {problemDetails.problems.length > 0 ? (
                                        <ul className="list-disc list-inside space-y-2 text-text-dark">
                                            {problemDetails.problems.map((prob: string, idx: number) => (
                                                <li key={idx}>{prob}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-text-dark">{rawProblem}</p>
                                    )}

                                    {problemDetails.carbonSavings && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <p className="text-sm font-medium text-green-700">Potential Carbon Savings: {problemDetails.carbonSavings}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Action / Report */}
                <div className="md:col-span-1">
                    <Card className="p-6 shadow-md sticky top-6">
                        <h3 className="text-xl font-bold text-text-dark mb-4">Expert Report</h3>
                        <p className="text-sm text-text-light mb-6">
                            Provide your professional advice and recommendations for the farmer.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-dark mb-2">Your Advice</label>
                                <textarea
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary-green focus:border-primary-green outline-none h-64 text-text-dark placeholder-text-light resize-none"
                                    placeholder="Type your detailed advice here..."
                                    value={advice}
                                    onChange={(e) => setAdvice(e.target.value)}
                                    disabled={isCompleted} // Disable if already completed
                                />
                            </div>

                            <Button
                                onClick={handleSubmit}
                                className="w-full flex justify-center items-center"
                                disabled={isSubmitting || isCompleted}
                            >
                                {isSubmitting ? 'Submitting...' : isCompleted ? 'Report Submitted' : 'Submit Report'}
                                {!isCompleted && <Send className="w-4 h-4 ml-2" />}
                            </Button>

                            {isCompleted && (
                                <p className="text-xs text-center text-green-600 font-medium mt-2">
                                    This consultation is closed.
                                </p>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default RequestDetailsPage;
