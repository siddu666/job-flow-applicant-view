'use client'

import { useAuth } from '@/contexts/auth-context'
import { useProfile } from '@/hooks/useProfile'
import { useJobRecommendations } from '@/hooks/useJobRecommendations'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, MapPin, Calendar, CheckCircle, AlertCircle, Target } from 'lucide-react'
import Link from 'next/link'

export default function JobRecommendations() {
    const { user } = useAuth()
    const { data: profile, isLoading: profileLoading } = useProfile(user?.id)
    const { data: recommendations = [], isLoading, error } = useJobRecommendations(user?.id)

    if (profileLoading || isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin mx-auto text-indigo-600" />
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Finding Your Perfect Matches
                        </h3>
                        <p className="text-gray-600">
                            We are analyzing thousands of opportunities to find the best jobs for you...
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex items-center justify-center p-6">
                <Card className="max-w-md w-full border-red-200 bg-red-50 shadow-lg">
                    <CardContent className="p-8 text-center">
                        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
                        <h3 className="text-xl font-semibold text-red-800 mb-3">
                            Oops! Something Went Wrong
                        </h3>
                        <p className="text-red-600 mb-6">
                            We encountered an error while fetching your job recommendations. Our team has been notified.
                        </p>
                        <Button
                            onClick={() => window.location.reload()}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-yellow-50 flex items-center justify-center p-6">
                <Card className="max-w-md w-full border-yellow-200 bg-yellow-50 shadow-lg">
                    <CardContent className="p-8 text-center">
                        <Target className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
                        <h3 className="text-xl font-semibold text-yellow-800 mb-3">
                            Complete Your Profile
                        </h3>
                        <p className="text-yellow-700 mb-6">
                            To get personalized job recommendations tailored to your skills and preferences, please complete your profile first.
                        </p>
                        <Link href="/profile">
                            <Button className="bg-yellow-600 hover:bg-yellow-700 text-white w-full">
                                Complete Profile Now
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!recommendations.length) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-6">
                <Card className="max-w-md w-full border-blue-200 bg-blue-50 shadow-lg">
                    <CardContent className="p-8 text-center">
                        <Target className="h-16 w-16 text-blue-500 mx-auto mb-6" />
                        <h3 className="text-xl font-semibold text-blue-800 mb-3">
                            No Recommendations Yet
                        </h3>
                        <p className="text-blue-700 mb-6">
                            We are still analyzing the job market to find the perfect opportunities for you. Check back soon for personalized recommendations!
                        </p>
                        <Button
                            onClick={() => window.location.reload()}
                            className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                        >
                            Refresh Recommendations
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const getScoreColor = (score: number): string => {
        if (score >= 80) return 'bg-green-100 text-green-800 border-green-200'
        if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
        return 'bg-red-100 text-red-800 border-red-200'
    }

    const getScoreIcon = (score: number) => {
        if (score >= 80) return <CheckCircle className="h-4 w-4" />
        if (score >= 60) return <AlertCircle className="h-4 w-4" />
        return <AlertCircle className="h-4 w-4" />
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl p-8 mb-8 text-white shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-white/20 rounded-full p-3">
                            <Target className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold mb-2">
                                Your Personalized Job Matches
                            </h1>
                            <p className="text-indigo-100 text-lg">
                                We found {recommendations.length} perfect job{recommendations.length !== 1 ? 's' : ''} tailored to your profile
                            </p>
                        </div>
                    </div>
                </div>

                {/* Job Recommendations Grid */}
                <div className="space-y-8">
                    {recommendations.map((recommendation) => (
                        <Card
                            key={recommendation.id}
                            className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-indigo-500 bg-white/80 backdrop-blur-sm"
                        >
                            <CardHeader className="pb-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <CardTitle className="text-2xl text-gray-900 mb-3 hover:text-indigo-600 transition-colors">
                                            {recommendation.title}
                                        </CardTitle>
                                        <div className="flex items-center gap-6 text-gray-600 mb-4">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-5 w-5 text-indigo-500" />
                                                <span className="font-medium">{recommendation.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge className={`${getScoreColor(recommendation.match_score)} flex items-center gap-2 text-base font-bold px-4 py-2 shadow-sm`}>
                                            {getScoreIcon(recommendation.match_score)}
                                            {recommendation.match_score}% Match
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-6">

                                {/* Job Details Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 rounded-lg p-6">
                                    <div className="text-center">
                                        <div className="text-gray-500 text-sm mb-1">Experience Level</div>
                                        <div className="font-semibold text-gray-900">
                                            {recommendation.experience_level || 'Not specified'}
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-gray-500 text-sm mb-1">Posted Date</div>
                                        <div className="font-semibold text-gray-900 flex items-center justify-center gap-2">
                                            <Calendar className="h-4 w-4 text-indigo-500" />
                                            {new Date(recommendation.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <div className="pt-6 border-t border-gray-200">
                                    <Link href={`/apply?jobId=${recommendation.id}`}>
                                        <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg py-3 rounded-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-[1.02]">
                                            Apply Now
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}